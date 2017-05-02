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