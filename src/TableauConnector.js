import axios from 'axios'

const tableau = window.tableau

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

export default class TableauConnector {

  constructor () {
    this.connector = tableau.makeConnector()
    this.connector.getSchema = this.getSchema
    this.connector.getData = this.getData
    this.submit = tableau.submit
    tableau.registerConnector(this.connector)
  }

  getApiEndpoint = (queryTable) => {
    const datasetCreds = JSON.parse(tableau.connectionData)
    return `https://query.data.world/sql/${datasetCreds.dataset}?authentication=Bearer+${datasetCreds.apiToken}&query=SELECT%20*%20FROM%20%60${queryTable}%60`
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
    const queryTable = 'TableColumns'
    return new Promise((resolve, reject) => {
      axios.get(this.getApiEndpoint(queryTable)).then((resp) => {
        if (resp.data && resp.data.results) {
          resolve()
        } else {
          reject()
        }
      }).catch(() => {
        reject()
      })
    })
  }

  getSchema = (callback) => {
    const queryTable = 'TableColumns'

    axios.get(this.getApiEndpoint(queryTable)).then((resp) => {
      const datasetTablesResults = resp.data.results.bindings
      const datasetTables = []

      for (let i = 0; i < datasetTablesResults.length; i += 1) {
        if (datasetTablesResults[i].v_2.value === '1') {
          const activeTable = datasetTablesResults[i].v_1.value
          const datasetCols = []

          for (let j = 0, len = datasetTablesResults.length; j < len; j += 1) {
            if (datasetTablesResults[j].v_1.value === activeTable) {
              const columnId = 'v_' + (datasetTablesResults[j].v_2.value - 1)

              datasetCols.push({
                id: columnId,
                alias: datasetTablesResults[j].v_3.value,
                dataType: this.getDatatype(datasetTablesResults[j].v_4.value)
              })
            }
          }

          const datasetTableId = activeTable.replace(/[^A-Z0-9]/ig, '')
          const datasetTable = {
            id: datasetTableId,
            alias: activeTable,
            columns: datasetCols
          }

          datasetTables.push(datasetTable)
        }
      }

      callback(datasetTables)
    }).catch(() => {
      callback()
    })
  }

  getData = (table, callback) => {
    const filesApiCall = this.getApiEndpoint(table.tableInfo.alias)

    axios.get(filesApiCall).then((resp) => {
      const results = resp.data.results.bindings
      const columnIds = resp.data.head.vars
      const tableData = []

      let i, j

      for (i = 0; i < results.length; i += 1) {
        const jsonData = {}
        for (j = 0; j < columnIds.length; j += 1) {
          const id = columnIds[j]
          if (results[i][id]) {
            if (results[i][columnIds[j]].datatype === 'http://www.w3.org/2001/XMLSchema#boolean') {
              jsonData[id] = results[i][columnIds[j]].value === 'true'
            } else {
              jsonData[id] = results[i][columnIds[j]].value
            }
          }
        }
        tableData.push(jsonData)
      }

      table.appendRows(tableData)
      callback()
    }).catch(function (error) {
      console.log(error)
    })
  }

  setConnectionData = (dataset, apiToken) => {
    tableau.connectionData = JSON.stringify({dataset, apiToken})
    tableau.connectionName = dataset
  }
}
