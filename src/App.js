import React, { Component } from 'react'
import TableauConnectorForm from './components/TableauConnectorForm'
import NotTableauView from './components/NotTableauView'
import TableauConnector from './TableauConnector'
import queryString from 'query-string'

const connector = new TableauConnector()

class App extends Component {

  getApiKey () {
    if (window.localStorage) {
      return window.localStorage.getItem('DW-API-KEY')
    }
    return
  }

  storeApiKey (key) {
    if (window.localStorage) {
      window.localStorage.setItem('DW-API-KEY', key)
    }
  }

  render () {
    const parsed = queryString.parse(location.search)
    const isTableau = navigator.userAgent.toLowerCase().indexOf('tableau') >= 0 || parsed.forceTableau
    const dataset = parsed.dataset_name ? `https://data.world/${parsed.dataset_name}` : null
    const apiKey = this.getApiKey()

    return (
      (isTableau
        ? <TableauConnectorForm connector={connector} dataset={dataset} apiKey={apiKey} setApiKey={this.storeApiKey} />
        : <NotTableauView />)
    )
  }
}

export default App
