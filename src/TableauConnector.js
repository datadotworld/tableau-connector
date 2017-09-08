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

import axios from 'axios'
import queryString from 'query-string'

const tableau = window.tableau

const DW_CONNECTOR_VERSION = '1.0.1';

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

const queryTable = 'TableColumns'

export default class TableauConnector {

  constructor () {
    this.connector = tableau.makeConnector()
    this.connector.getSchema = this.getSchema
    this.connector.getData = this.getData
    this.submit = tableau.submit
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.post['Accept'] = 'application/json';
    tableau.registerConnector(this.connector)
  }

  /**
   * Valid names for Tableau can only include alphanumeric characters 
   * plus underscore
   */
  isNameValid = (name) => {
    return /^\w+$/.test(name)
  }

  escapeDashes = (name) => {
    return name.replace(/-/g, '_')
  }

  isProject = (bindings, ownerKey, datasetKey) => {
    const datasets = {}

    bindings.forEach((binding) => {
      const dataset = `${binding[ownerKey].value}/${binding[datasetKey].value}`
      datasets[dataset] = true
    })
    return Object.keys(datasets).length > 1
  }

  getQuery = (tableName) => {
    const datasetCreds = JSON.parse(tableau.connectionData)
    let { query } = datasetCreds
    if (!query) {
      // Projects need to have their agentid.dataset.tablename split and backticked
      tableName = tableName.split('.').join('`.`')
      query = `SELECT * FROM \`${tableName}\``
    }
    return query
  }

  isCustomQuery = () => {
    const datasetCreds = JSON.parse(tableau.connectionData)
    return !!datasetCreds.query
  }

  isSparqlQuery = () => {
    const datasetCreds = JSON.parse(tableau.connectionData)
    return datasetCreds.queryType && datasetCreds.queryType.toLowerCase() === 'sparql'
  }

  getApiEndpoint = () => {
    const datasetCreds = JSON.parse(tableau.connectionData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${datasetCreds.apiToken}`
    return `https://query.data.world/${datasetCreds.queryType || 'sql'}/${datasetCreds.dataset}`
  }

  getDatatype = (datatype) => {
    if (schemaMap[datatype]) {
      return schemaMap[datatype]
    } else {
      return tableau.dataTypeEnum.string
    }
  }

  /**
   * Used to verify that the dataset exists and the API key works
   */
  verify = () => {
    return new Promise((resolve, reject) => {
      this.getSchema((schema) => {
        if (schema && schema.length) {
          // Validate column names
          schema[0].columns.forEach((column) => {
            if (!this.isNameValid(column.id)) {
              reject({message: `"${column.id}" is not a valid column name. To work in Tableau, columns must contain only letters, numbers, or underscores. To fix this issue, make sure to modify your query and use alias to ensure all column names are valid.`})
            }
          })
          resolve()
        }
        reject()
      })
    })
  }

  getSchemaForDataset = (resp) => {
    const datasetTablesResults = resp.data.results.bindings
    const metadata = resp.data.metadata
    const datasetTables = []

    const datasetCreds = JSON.parse(tableau.connectionData)

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

    const isProject = this.isProject(datasetTablesResults, owner, dataset)

    for (let i = 0; i < datasetTablesResults.length; i += 1) {
      if (datasetTablesResults[i][columnIndex].value === '1') {
        const activeTable = datasetTablesResults[i][tableId].value
        const datasetCols = []

        for (let j = 0, len = datasetTablesResults.length; j < len; j += 1) {
          if (datasetTablesResults[j][tableId].value === activeTable) {
            let columnId = 'v_' + (parseInt(datasetTablesResults[j][columnIndex].value, 10) - 1)
            if (datasetCreds.version) {
              columnId = datasetTablesResults[j][columnName].value
            }

            datasetCols.push({
              id: columnId,
              alias: datasetTablesResults[j][columnTitle].value,
              dataType: this.getDatatype(datasetTablesResults[j][columnDatatype].value)
            })
          }
        }

        let datasetTableId = datasetTablesResults[i][tableName].value
        if (isProject) {
          const tableOwner = this.escapeDashes(datasetTablesResults[i][owner].value)
          const tableDataset = this.escapeDashes(datasetTablesResults[i][dataset].value)
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
    return datasetTables
  }

  getSchemaForSqlQuery = (resp) => {
    const metadata = resp.data.metadata
    const datasetCreds = JSON.parse(tableau.connectionData)
    const datasetTables = []

    const columns = []

    metadata.forEach((m, index) => {
      columns.push({
        id: datasetCreds.version ? m.name : resp.data.head.vars[index],
        alias: m.name,
        dataType: this.getDatatype(m.type)
      })
    })

    datasetTables.push({
      columns,
      id: 'QueryTable',
      alias: 'Query Results'
    })

    return datasetTables
  }

  getSchemaForSparqlQuery = (resp) => {
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

    return datasetTables
  }

  getSchema = (callback) => {
    let query = this.getQuery(queryTable)
    axios.post(this.getApiEndpoint(), queryString.stringify({query})).then((resp) => {
      if (this.isCustomQuery()) {
        if (this.isSparqlQuery()) {
          callback(this.getSchemaForSparqlQuery(resp))
        } else {
          callback(this.getSchemaForSqlQuery(resp))
        }
      } else {
        callback(this.getSchemaForDataset(resp))
      }
    }).catch((error) => {
      tableau.log(error)
      tableau.log('There was an error retrieving the schema')
      tableau.abortWithError(error)
    })
  }

  getData = (table, callback) => {
    let query = this.getQuery(table.tableInfo.alias)
    const filesApiCall = this.getApiEndpoint()

    const datasetCreds = JSON.parse(tableau.connectionData)

    axios.post(filesApiCall, queryString.stringify({query})).then((resp) => {
      const results = resp.data.results.bindings
      const columnIds = resp.data.head.vars.map((key, index) => {
        return {
          id: key,
          // SPARQL queries do not return a metadata object here
          name: (datasetCreds.version && resp.data.metadata) ? resp.data.metadata[index].name : key
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
      callback()
    }).catch(function (error) {
      tableau.log(error)
      tableau.log('There was an error retrieving the data')
      tableau.abortWithError(error)
    })
  }

  setConnectionData = (dataset, apiToken, query, queryType) => {
    tableau.log('setting connection data');
    tableau.connectionData = JSON.stringify({dataset, apiToken, query, queryType, version: DW_CONNECTOR_VERSION})
    tableau.connectionName = dataset
  }
}
