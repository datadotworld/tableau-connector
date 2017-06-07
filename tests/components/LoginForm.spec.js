import '../util'
import renderer from 'react-test-renderer'

import React from 'react'
import ReactDOM from 'react-dom'
import LoginForm from '../../src/components/LoginForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LoginForm />, div)
})

it('renders form', () => {
  expect(renderer.create(<LoginForm />).toJSON()).toMatchSnapshot()
})