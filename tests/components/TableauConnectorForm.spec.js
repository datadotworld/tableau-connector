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

import '../util'
import renderer from 'react-test-renderer'

import React from 'react'
import ReactDOM from 'react-dom'
import TableauConnectorForm from '../../src/components/TableauConnectorForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<TableauConnectorForm />, div)
})

it('renders form', () => {
  expect(renderer.create(<TableauConnectorForm />).toJSON()).toMatchSnapshot()
})

it('renders form with default values', () => {
  expect(renderer.create(<TableauConnectorForm dataset='https://data.world/test/test' apiKey='testtest-testtest'/>).toJSON()).toMatchSnapshot()
})

it('renders form with query input, sql selected', () => {
  expect(renderer.create(<TableauConnectorForm dataset='https://data.world/test/test' apiKey='testtest-testtest' query='example sql query' queryType='sql'/>).toJSON()).toMatchSnapshot()
})

it('renders form with query input, sparql selected', () => {
  expect(renderer.create(<TableauConnectorForm dataset='https://data.world/test/test' apiKey='testtest-testtest' query='example sparql query' queryType='sparql'/>).toJSON()).toMatchSnapshot()
})