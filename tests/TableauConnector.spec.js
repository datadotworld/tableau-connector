jest.mock('axios')

import './util'
import TableauConnector from '../src/TableauConnector'
import {schemaData, tableData} from './apiResponseData'
import axios from 'axios'

it('Initializes the tableau connector correctly', () => {
  const connector = new TableauConnector()
  expect(global.tableau.makeConnector.mock.calls.length).toBe(1)
  expect(global.tableau.registerConnector.mock.calls.length).toBe(1)

  const internalConnector = connector.connector
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
    expect(schemaData).toMatchSnapshot()

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
    appendRows: jest.fn()
  }
  connector.getData(table, () => {
    expect(table.appendRows.mock.calls.length).toBe(1)
    expect(table.appendRows.mock.calls[0][0]).toEqual([
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