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
  expect(typeof internalConnector.init).toBe('function')
  expect(typeof internalConnector.getSchema).toBe('function')
  expect(typeof internalConnector.getData).toBe('function')
})

it('Returns default tableauschema type', () => {
  expect(TableauConnector.getDatatype('randommissingdatatype')).toBe('string')
})

it('Formats the schema correctly for a non-query, no version', (done) => {
  axios.__setMockResponse(schemaData)
  const connector = new TableauConnector()
  connector.params = {}
  connector.setConnectionData('test/1234')
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
  connector.setConnectionData('test/1234')
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(3)
    expect(schema).toMatchSnapshot()

    done()
  })
})


it('Formats the schema correctly for a project', (done) => {
  axios.__setMockResponse(schemaDataProject)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234')
  connector.getSchema((schema) => {
    expect(schema).toHaveLength(2)
    expect(schema).toMatchSnapshot()

    done()
  })
})

it('Formats the schema correctly for a SPARQL query', (done) => {
  axios.__setMockResponse(sparqlSchemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'EXAMPL SPARQL QUERY', 'sparql')
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
  connector.setConnectionData('test/1234', 'SELECT * FROM TEST', 'sql')
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
  connector.setConnectionData('test/1234')
  expect(TableauConnector.getSelectAllQuery('agentid.dataset.table')).toBe('SELECT * FROM `agentid`.`dataset`.`table`')
})

it('formats the table correctly for a SPARQL query', (done) => {
  axios.__setMockResponse(sparqlSchemaData)
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234', 'test', 'SPARQL')
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
  connector.setConnectionData('test/1234')
  connector.validateParams().catch((error) => {
    expect(error.message).toMatchSnapshot()
    done()
  })
})

it ('fails verification if getSchema call fails', (done) => {
  axios.__rejectNext()
  const connector = new TableauConnector()
  connector.setConnectionData('test/1234')
  connector.validateParams().catch(done)
})
