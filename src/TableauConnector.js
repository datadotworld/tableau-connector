/*
 * Copyright 2017 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

import * as auth from './auth'
import * as api from './api'
import analytics from './analytics'
import * as utils from './util.js'

const tableau = window.tableau

const DW_CONNECTOR_VERSION = '1.1.0'

const schemaMap = {
  'http://www.w3.org/2001/XMLSchema#boolean': tableau.dataTypeEnum.bool,
  'http://www.w3.org/2001/XMLSchema#integer': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#nonPositiveInteger': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#nonNegativeInteger': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#negativeInteger': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#long': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#int': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#short': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#byte': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#unsignedLong': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#unsignedInt': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#unsignedShort': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#unsignedByte': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#positiveInteger': tableau.dataTypeEnum.int,
  'http://www.w3.org/2001/XMLSchema#decimal': tableau.dataTypeEnum.float,
  'http://www.w3.org/2001/XMLSchema#float': tableau.dataTypeEnum.float,
  'http://www.w3.org/2001/XMLSchema#double': tableau.dataTypeEnum.float,
  'http://www.w3.org/2001/XMLSchema#date': tableau.dataTypeEnum.date,
  'http://www.w3.org/2001/XMLSchema#dateTime': tableau.dataTypeEnum.datetime,
  'http://www.w3.org/2001/XMLSchema#dateTimeStamp': tableau.dataTypeEnum.datetime
}

const metadataTable = 'TableColumns'

class TableauConnector {
  constructor (uiCallback, params, code) {
    const connData = JSON.parse(tableau.connectionData || '""')
    this.params = connData ? {
      dataset_name: connData.dataset,
      query: connData.query,
      queryType: connData.queryType,
      forceTableau: connData.forceTableau
    } : params
    this.code = code

    this.uiCallback = uiCallback

    this.submit = tableau.submit

    this.connector = tableau.makeConnector()
    this.connector.init = this.init.bind(this)
    this.connector.getSchema = this.getSchema.bind(this)
    this.connector.getData = this.getData.bind(this)

    tableau.registerConnector(this.connector)
  }

  async authenticate () {
    utils.log('START: Authenticate')
    if (this.code && tableau.phase !== tableau.phaseEnum.gatherDataPhase) {
      utils.log('SUCCESS: Authenticate (oauth)')
      const code = this.code
      return auth.exchangeCodeForTokens(code).then(({accessToken, refreshToken}) => {
        // Restore canonical WDC URL, which Tableau saves with data source
        const canonicalQueryString = Object.keys(this.params)
          .filter(key => !!this.params[key])
          .reduce((prev, key) => {
            return `${prev ? prev + '&' : '?'}${encodeURIComponent(key)}=${encodeURIComponent(this.params[key])}`
          }, '')
        window.location = `/${canonicalQueryString}`

        // For correctness only. Should never be reached.
        return Promise.resolve({accessToken, refreshToken})
      })
    } else {
      const accessToken = await auth.getAccessToken(true)
      const refreshToken = auth.getRefreshToken(true)
      utils.log(`SUCCESS: Authenticate (cached: ${refreshToken ? 'hit' : 'miss'})`)
      return Promise.resolve({accessToken, refreshToken})
    }
  }

  validateAccessIfNeeded (accessToken, refreshToken) {
    utils.log('START: Validate access')
    if (tableau.phase === tableau.phaseEnum.gatherDataPhase) {
      return api.getUser()
        .then((user) => {
          utils.log('SUCCESS: Validate access')
          analytics.identify(user.id)
          return Promise.resolve({accessToken, refreshToken})
        })
        .catch(() => {
          utils.log('FAILURE: Validate access')
          tableau.abortForAuth('The data.world auth token expired or was revoked')
        })
    } else {
      utils.log('SUCCESS: Validate access (not needed)')
      return Promise.resolve({accessToken, refreshToken})
    }
  }

  init (initCallback) {
    utils.log(`START: Init (${tableau.phase})`)
    tableau.authType = tableau.authTypeEnum.custom

    this.authenticate()
      .then(({accessToken, refreshToken}) => this.validateAccessIfNeeded(accessToken, refreshToken))
      .then(({accessToken, refreshToken}) => {
        const hasAuth = !!accessToken
        utils.log(`HAS AUTH: ${hasAuth}`)

        if (!hasAuth) {
          auth.redirectToAuth(this.params)
        }

        utils.log('START: Phase ' + tableau.phase)
        this.updateUIState(tableau.phase === tableau.phaseEnum.interactivePhase)
        initCallback()
        // If we are not in the data gathering phase, we want to store the token
        // This allows us to access the token in the data gathering phase
        if (tableau.phase === tableau.phaseEnum.interactivePhase ||
          tableau.phase === tableau.phaseEnum.authPhase) {
          if (hasAuth) {
            auth.storeRefreshToken(refreshToken)
            if (tableau.phase === tableau.phaseEnum.authPhase) {
              // Auto-submit here if we are in the auth phase
              tableau.submit()
            }
          }
        }
        utils.log(`SUCCESS: Init (${tableau.phase})`)
      })
  }

  updateUIState (interactivePhase) {
    this.uiCallback(interactivePhase)
  }

  getSchemaForDataset (resp) {
    utils.log('START: Schema for dataset')
    const datasetTablesResults = resp.data.results.bindings
    const metadata = resp.data.metadata
    const datasetTables = []

    const connData = JSON.parse(tableau.connectionData || '{}')

    const metadataMap = {}

    metadata.forEach((m, index) => {
      metadataMap[m.name] = resp.data.head.vars[index]
    })
    const {
      columnIndex,
      columnDatatype,
      columnName,
      columnTitle,
      dataset,
      owner,
      tableId,
      tableName
    } = metadataMap

    const isProject = TableauConnector.isProject(datasetTablesResults, owner, dataset)

    for (let i = 0; i < datasetTablesResults.length; i += 1) {
      if (datasetTablesResults[i][columnIndex].value === '1') {
        const activeTable = datasetTablesResults[i][tableId].value
        const datasetCols = []

        for (let j = 0, len = datasetTablesResults.length; j < len; j += 1) {
          if (datasetTablesResults[j][tableId].value === activeTable) {
            let columnId = 'v_' + (parseInt(datasetTablesResults[j][columnIndex].value, 10) - 1)
            if (connData.version) {
              columnId = datasetTablesResults[j][columnName].value
            }

            datasetCols.push({
              id: columnId,
              alias: datasetTablesResults[j][columnTitle].value,
              dataType: TableauConnector.getDatatype(datasetTablesResults[j][columnDatatype].value)
            })
          }
        }

        let datasetTableId = datasetTablesResults[i][tableName].value
        if (isProject) {
          const tableOwner = TableauConnector.escapeDashes(datasetTablesResults[i][owner].value)
          const tableDataset = TableauConnector.escapeDashes(datasetTablesResults[i][dataset].value)
          const tableTableName = datasetTablesResults[i][tableName].value
          datasetTableId = `${tableOwner}__${tableDataset}__${tableTableName}`
        }
        const datasetTable = {
          id: datasetTableId,
          alias: activeTable,
          columns: datasetCols
        }

        datasetTables.push(datasetTable)
      }
    }
    utils.log('SUCCESS: Schema for dataset')
    return datasetTables
  }

  getSchemaForSqlQuery (resp) {
    utils.log('START: Schema for SQL query')
    const metadata = resp.data.metadata
    const connData = JSON.parse(tableau.connectionData || '{}')
    const datasetTables = []

    const columns = []

    metadata.forEach((m, index) => {
      columns.push({
        id: connData.version ? m.name : resp.data.head.vars[index],
        alias: m.name,
        dataType: TableauConnector.getDatatype(m.type)
      })
    })

    datasetTables.push({
      columns,
      id: 'QueryTable',
      alias: 'Query Results'
    })
    utils.log('SUCCESS: Schema for SQL query')
    return datasetTables
  }

  getSchemaForSparqlQuery (resp) {
    utils.log('START: Schema for SPARQL query')
    const datasetTables = []
    const columns = resp.data.head.vars.map((entry) => {
      return {
        id: entry,
        alias: entry,
        dataType: tableau.dataTypeEnum.string
      }
    })

    datasetTables.push({
      columns,
      id: 'QueryTable',
      alias: 'Query Results'
    })
    utils.log('SUCCESS: Schema for SPARQL query')
    return datasetTables
  }

  getSchema (schemaCallback, failureCallback = tableau.abortWithError) {
    utils.log('START: Schema')
    const connData = JSON.parse(tableau.connectionData || '{}')
    const {dataset, queryType} = connData
    const query = connData.query || TableauConnector.getSelectAllQuery(metadataTable)

    api.runQuery(dataset, query, queryType)
      .then((resp) => {
        if (connData.query) {
          if (queryType === 'sparql') {
            schemaCallback(this.getSchemaForSparqlQuery(resp))
          } else {
            schemaCallback(this.getSchemaForSqlQuery(resp))
          }
        } else {
          schemaCallback(this.getSchemaForDataset(resp))
        }
        utils.log('SUCCESS: Schema')
      }).catch(error => {
        utils.log(`FAILURE: Schema (${error})`)
        failureCallback(error)
      })
  }

  getData (table, dataCallback) {
    utils.log('START: Data')
    const connData = JSON.parse(tableau.connectionData || '{}')
    const {dataset, queryType} = connData

    const query = connData.query || TableauConnector.getSelectAllQuery(table.tableInfo.alias)

    api.runQuery(dataset, query, queryType).then((resp) => {
      const results = resp.data.results.bindings
      const columnIds = resp.data.head.vars.map((key, index) => {
        return {
          id: key,
          // SPARQL queries do not return a metadata object here
          name: (connData.version && resp.data.metadata) ? resp.data.metadata[index].name : key
        }
      })

      const tableData = []

      let i, j

      for (i = 0; i < results.length; i += 1) {
        const jsonData = {}
        for (j = 0; j < columnIds.length; j += 1) {
          const {id, name} = columnIds[j]
          if (results[i][id]) {
            if (results[i][id].datatype === 'http://www.w3.org/2001/XMLSchema#boolean') {
              jsonData[name] = results[i][id].value === 'true'
            } else {
              jsonData[name] = results[i][id].value
            }
          }
        }
        tableData.push(jsonData)
      }

      table.appendRows(tableData)
      dataCallback()
      utils.log('SUCCESS: Data')
    }).catch(error => {
      tableau.abortWithError(error)
      utils.log(`FAILURE: Data (${error})`)
    })
  }

  setConnectionData (dataset, query, queryType) {
    utils.log('START: Setting connection data')
    tableau.connectionData = JSON.stringify({
      dataset,
      query,
      queryType,
      version: DW_CONNECTOR_VERSION
    })
    tableau.connectionName = dataset
    utils.log('SUCCESS: Setting connection data')
  }

  /**
   * Used to verify that the dataset exists and the API key works
   */
  validateParams () {
    return new Promise((resolve, reject) => {
      this.getSchema((schema) => {
        if (schema && schema.length) {
          // Validate column names
          schema[0].columns.forEach((column) => {
            if (!TableauConnector.isNameValid(column.id)) {
              reject(new Error(`"${column.id}" is not a valid column name. To work in Tableau, columns must contain only letters, numbers, or underscores. To fix this issue, make sure to modify your query and use alias to ensure all column names are valid.`))
            }
          })
          resolve()
        }
        reject(new Error('Dataset contains zero tables. To work in Tableu, datasets must contain at least one table.'))
      }, error => {
        if (error.response && error.response.status === 401) {
          auth.redirectToAuth(this.params)
        } else {
          reject(error)
        }
      })
    })
  }

  static escapeDashes (name) {
    return name.replace(/-/g, '_')
  }

  static getDatatype (datatype) {
    if (schemaMap[datatype]) {
      return schemaMap[datatype]
    } else {
      return tableau.dataTypeEnum.string
    }
  }

  static getSelectAllQuery (tableName) {
    // Projects need to have their agentid.dataset.tablename split and backticked
    tableName = '`' + tableName.split('.').join('`.`') + '`'
    return `SELECT * FROM ${tableName}`
  }

  /**
   * Valid names for Tableau can only include alphanumeric characters
   * plus underscore
   */
  static isNameValid (name) {
    return /^\w+$/.test(name)
  }

  static isProject (bindings, ownerKey, datasetKey) {
    const datasets = {}

    bindings.forEach((binding) => {
      const dataset = `${binding[ownerKey].value}/${binding[datasetKey].value}`
      datasets[dataset] = true
    })
    return Object.keys(datasets).length > 1
  }
}

export default TableauConnector
