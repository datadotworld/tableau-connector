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

jest.mock('axios')

import './util'
import TableauConnector from '../src/TableauConnector'
import {
  schemaData,
  schemaDataProject,
  schemaWithInvalidColumnNameData,
  sparqlSchemaData,
  sqlSchemaData,
  tableData
} from './apiResponseData'
import axios from 'axios'

it('Initializes the tableau connector correctly', () => {
  const connector = new TableauConnector()
  expect(global.tableau.makeConnector.mock.calls.length).toBe(1)
  expect(global.tableau.registerConnector.mock.calls.length).toBe(1)

  const internalConnector = connector.connector
  expect(typeof internalConnector.getSchema).toBe('function')
  expect(typeof internalConnector.getData).toBe('function')
})

it('Returns the correct API endpoint for non-query', () => {
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'apitoken-test')
  expect(connector.getApiEndpoint('table-name-test')).toBe('https://query.data.world/sql/test/1234')
})

it('Returns the correct API endpoint for SQL query', () => {
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'apitoken-test', 'SELECT * FROM TEST', 'sql')
  expect(connector.getApiEndpoint('table-name-test')).toBe('https://query.data.world/sql/test/1234')
})

it('Returns the correct API endpoint for SPARQL query', () => {
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'apitoken-test', 'SPARQL TEST QUERY', 'sparql')
  expect(connector.getApiEndpoint('table-name-test')).toBe('https://query.data.world/sparql/test/1234')
})

it('Returns default tableauschema type', () => {
  const connector = new TableauConnector()
  expect(connector.getDatatype('randommissingdatatype')).toBe('string')
})

it('Formats the schema correctly for a non-query, no version', (done) => {
  axios.__setMockResponse(schemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'schema-test')
  const tempConnectionData = JSON.parse(tableau.connectionData)
  tempConnectionData.version = null
  tableau.connectionData = JSON.stringify(tempConnectionData)
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(3)
    expect(schema).toMatchSnapshot()

    done()
  })
})

it('Formats the schema correctly for a non-query, with version', (done) => {
  axios.__setMockResponse(schemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'schema-test')
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(3)
    expect(schema).toMatchSnapshot()

    done()
  })
})


it('Formats the schema correctly for a project', (done) => {
  axios.__setMockResponse(schemaDataProject)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'sql-schema-test')
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(2)
    expect(schema).toMatchSnapshot()

    done()
  })
})

it('Formats the schema correctly for a SPARQL query', (done) => {
  axios.__setMockResponse(sparqlSchemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'sql-schema-test', 'EXAMPL SPARQL QUERY', 'sparql')
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(1)
    expect(schema[0].columns).toHaveLength(6)
    expect(schema).toMatchSnapshot()

    done()
  })
})

it('Formats the schema correctly for a SQL query', (done) => {
  axios.__setMockResponse(sqlSchemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'sql-schema-test', 'SELECT * FROM TEST', 'sql')
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(1)
    expect(schema[0].columns).toHaveLength(3)
    expect(schema).toMatchSnapshot()

    done()
  })
})

it('formats the table correctly, no version', (done) => {
  axios.__setMockResponse(tableData)
  const connector = new TableauConnector()
  tableau.connectionData = JSON.stringify({})
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

it('formats the table correctly, with version', (done) => {
  axios.__setMockResponse(tableData)
  const connector = new TableauConnector()
  tableau.connectionData = JSON.stringify({version: '1.1.1'})
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
        Date: '2016-12-14',
        Change: 'Test test test'
      },
      {
        Date: '2016-12-14',
        Change: 'Test test'
      }
    ])
    done()
  })
})

it('formats the request for a project dataset correctly', () => {
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'sql-schema-test')
  expect(connector.getQuery('agentid.dataset.table')).toBe('SELECT * FROM `agentid`.`dataset`.`table`')
})

it('formats the table correctly for a SPARQL query', (done) => {
  axios.__setMockResponse(sparqlSchemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'sql-schema-test', 'test', 'SPARQL')
  const table = {
    tableInfo: {
      alias: 'test'
    },
    appendRows: jest.fn()
  }
  connector.getData(table, () => {
    expect(table.appendRows.mock.calls.length).toBe(1)
    expect(table.appendRows.mock.calls[0][0][0]).toEqual({
      name: 'Jon',
      height: '6\'5"',
      heightInInches: '77',
      hand: 'Right',
      ppg: '20.4',
      apg: '1.3'
    })
    done();
  })
})

it('rejects invalid column names', (done) => {
  axios.__setMockResponse(schemaWithInvalidColumnNameData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'sql-schema-test')
  connector.verify().catch((error) => {
    expect(error.message).toMatchSnapshot()
    done()
  })
})
