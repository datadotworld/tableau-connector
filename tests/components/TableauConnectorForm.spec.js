import '../util'
import renderer from 'react-test-renderer'

import React from 'react'
import ReactDOM from 'react-dom'
import TableauConnectorForm from '../../src/components/TableauConnectorForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<TableauConnectorForm setApiKey={jest.fn()}/>, div)
})

it('renders form', () => {
  expect(renderer.create(<TableauConnectorForm setApiKey={jest.fn()}/>).toJSON()).toMatchSnapshot()
})

it('renders form with default values', () => {
  expect(renderer.create(<TableauConnectorForm setApiKey={jest.fn()} dataset='https://data.world/test/test' apiKey='testtest-testtest'/>).toJSON()).toMatchSnapshot()
})