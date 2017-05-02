import renderer from 'react-test-renderer'

import React from 'react'
import ReactDOM from 'react-dom'
import NotTableauView from '../../src/components/NotTableauView'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<NotTableauView />, div)
})

it('renders form', () => {
  expect(renderer.create(<NotTableauView />).toJSON()).toMatchSnapshot()
})