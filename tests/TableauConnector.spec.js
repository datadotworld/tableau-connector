jest.mock('axios')

import TableauConnector from '../src/TableauConnector'
import {schemaData, tableData} from './apiResponseData'
import axios from 'axios'
import sinon from 'sinon'

it('Initializes the tableau connector correctly', () => {
  const connector = new TableauConnector()
  expect(global.tableau.makeConnector.calledOnce)
  expect(global.tableau.registerConnector.calledOnce)
  const internalConnector = global.tableau.makeConnector.returnValues[0]
  expect(typeof internalConnector.getSchema).toBe('function')
  expect(typeof internalConnector.getData).toBe('function')
})

it('Returns the correct API endpoint', () => {
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'apitoken-test')
  expect(connector.getApiEndpoint('table-name-test'))
    .toBe('https://query.data.world/sql/test/1234?authentication=Bearer+apitoken-test&query=SELECT%20*%20FROM%20%60table-name-test%60')
})

it('Returns default tableauschema type', () => {
  const connector = new TableauConnector()
  expect(connector.getDatatype('randommissingdatatype')).toBe('string')
})

it('Formats the schema correctly', (done) => {
  axios.__setMockResponse(schemaData)
  const connector = new TableauConnector()
  connector.getSchema((schemaData) => {
    expect(schemaData).toHaveLength(3)
    const changeLogSheet = schemaData[0]
    expect(changeLogSheet.alias).toBe('AnIntrotodata.worldDatasetChangeLog-Sheet1')
    expect(changeLogSheet.columns).toHaveLength(2)
    expect(changeLogSheet.columns[0]).toEqual({
      alias: 'Date',
      dataType: 'date',
      id: 'v_0'
    })

    expect(schemaData[1]).toEqual({
      alias: 'DataDotWorldBBallStats',
      columns: [
        {
          alias: 'Name',
          dataType: 'string',
          id: 'v_0'
        },
        {
          alias: 'PointsPerGame',
          dataType: 'float',
          id: 'v_1'
        },
        {
          alias: 'AssistsPerGame',
          dataType: 'float',
          id: 'v_2'
        }
      ],
      id: 'DataDotWorldBBallStats'
    })

    done()
  })
})

it('formats the table correctly', (done) => {
  axios.__setMockResponse(tableData)
  const connector = new TableauConnector()
  const table = {
    tableInfo: {
      alias: 'test'
    },
    appendRows: sinon.spy()
  }
  connector.getData(table, () => {
    expect(table.appendRows.calledOnce)
    expect(table.appendRows.args[0][0]).toEqual([
      {
        v_0: '2016-12-14',
        v_1: 'Test test test'
      },
      {
        v_0: '2016-12-14',
        v_1: 'Test test'
      }
    ])
    done()
  })
})