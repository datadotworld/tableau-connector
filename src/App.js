import React, { Component } from 'react'
import TableauConnectorForm from './components/TableauConnectorForm'
import NotTableauView from './components/NotTableauView'
import TableauConnector from './TableauConnector'
import queryString from 'query-string'

const tableau = window.tableau
const connector = new TableauConnector()

class App extends Component {

  constructor () {
    super()
    this.oauthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID
    this.oauthRedirectURI = process.env.REACT_APP_OAUTH_REDIRECT_URI

    this.parsedQueryString = queryString.parse(location.search)
    let { dataset_name } = this.parsedQueryString
    if (dataset_name) {
      this.storeDataset(dataset_name)
    } else {
      dataset_name = this.getDataset()
    }

    this.isTableau = navigator.userAgent.toLowerCase().indexOf('tableau') >= 0 || this.parsedQueryString.forceTableau
    const apiKey = this.getApiKey()

    if (!apiKey && this.isTableau) {
      this.redirectToAuth()
    }

    this.state = {
      apiKey,
      datasetName: dataset_name
    }
    this.clearApiKey = this.clearApiKey.bind(this)
    this.clearDataset = this.clearDataset.bind(this)
  }

  redirectToAuth () {
    window.location = `https://data.world/oauth/authorize?client_id=${this.oauthClientId}&redirect_uri=${this.oauthRedirectURI}`
  }

  apiKeyHasExpired (apiKey) {
    try {
      const decoded = JSON.parse(atob(apiKey.split('.')[1]))
      const expirationTimeInMilliseconds = decoded.exp * 1000
      if (expirationTimeInMilliseconds < new Date().getTime()) {
        return true
      }
      return false
    } catch (error) {
      tableau.log('There was an error decoding a JWT token')
      tableau.log(error)
      return true
    }
  }

  getApiKey () {
    // the OAuth flow will return the token in the query string
    if (this.parsedQueryString.token) {
      this.storeApiKey(this.parsedQueryString.token)
      return this.parsedQueryString.token
    }
    if (window.localStorage) {
      let apiKey = window.localStorage.getItem('DW-API-KEY')
      if (apiKey && this.apiKeyHasExpired(apiKey)) {
        apiKey = null
      }
      return apiKey
    }
    return
  }

  storeApiKey (key) {
    if (window.localStorage) {
      window.localStorage.setItem('DW-API-KEY', key)
    }
  }

  getDataset () {
    if (window.localStorage) {
      return window.localStorage.getItem('DW-DATASET-NAME')
    }
    return
  }

  storeDataset (key) {
    if (window.localStorage) {
      window.localStorage.setItem('DW-DATASET-NAME', key)
    }
  }

  clearApiKey () {
    this.setState({
      apiKey: null
    })
    this.storeApiKey('')
    this.redirectToAuth()
  }

  clearDataset () {
    this.setState({
      datasetName: ''
    })
    this.storeDataset('')
  }

  render () {
    const { apiKey, datasetName } = this.state
    const dataset = datasetName ? `https://data.world/${datasetName}` : null

    if (! this.isTableau) {
      return (<NotTableauView />)
    }

    return (
      (apiKey ? <TableauConnectorForm connector={connector} dataset={dataset} apiKey={apiKey} clearDataset={this.clearDataset} clearApiKey={this.clearApiKey} />
        : <div/>)
    )
  }
}

export default App
