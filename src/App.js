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

import React, { Component } from 'react'
import TableauConnectorForm from './components/TableauConnectorForm'
import NotTableauView from './components/NotTableauView'
import TableauConnector from './TableauConnector'
import queryString from 'query-string'
import {
  getToken,
  getAuthUrl,
  getCodeVerifier
} from './util';

const tableau = window.tableau
const connector = new TableauConnector()

class App extends Component {

  constructor () {
    super()

    this.parsedQueryString = queryString.parse(location.search)
    let { dataset_name, query, queryType, token, code } = this.parsedQueryString
    const codeVerifier = window.localStorage.getItem('DW-CODE-VERIFIER')

    // Prevents generation on a new code_verifier upon a redirect
    if (!codeVerifier) {
      // To enable its use for both code_challenge and code_verifier
      window.localStorage.setItem('DW-CODE-VERIFIER', getCodeVerifier())
    }

    if (!token) {
      // Only use stored data if returning from auth
      this.clearStoredData();
    }

    if (dataset_name) {
      this.storeDataset(dataset_name)
    } else {
      dataset_name = this.getDataset()
    }

    if (query) {
      queryType = queryType ? queryType.toLowerCase() : 'sql'
      this.storeQuery(query, queryType)
    } else {
      ({query, queryType} = this.getQuery())
    }

    // window.tableauVersionBootstrap is always defined in Tableau environments (desktop/server)
    // parsedQueryString.forceTableau enables debugging on a browser
    this.isTableau = window.tableauVersionBootstrap || this.parsedQueryString.forceTableau
    const apiKey = this.getApiKey()

    if (!apiKey && this.isTableau) {
      if (code) {
        getToken(code)
        .then(response => {
          const token = response.data.access_token;
          if (token) {
            window.localStorage.removeItem('DW-CODE-VERIFIER')
            window.location = `http://localhost:3000?token=${token}`
          }
        })
      } else {
        this.redirectToAuth()
      }
    }

    this.state = {
      apiKey,
      query,
      queryType,
      datasetName: dataset_name
    }
    this.clearApiKey = this.clearApiKey.bind(this)
    this.clearStoredData = this.clearStoredData.bind(this)
  }

  redirectToAuth () {
    window.location = getAuthUrl(this.codeVerifier)
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
    window.localStorage.setItem('DW-API-KEY', key)
  }

  getDataset () {
    return window.localStorage.getItem('DW-DATASET-NAME')
  }

  storeDataset (dataset) {
    window.localStorage.setItem('DW-DATASET-NAME', dataset)
  }

  storeQuery (query, queryType) {
    window.localStorage.setItem('DW-QUERY', query)
    window.localStorage.setItem('DW-QUERY-TYPE', queryType || '')
  }

  getQuery () {
    return {
      query: window.localStorage.getItem('DW-QUERY'),
      queryType: window.localStorage.getItem('DW-QUERY-TYPE')
    }
  }

  clearApiKey () {
    this.setState({
      apiKey: null
    })
    this.storeApiKey('')
    this.redirectToAuth()
  }

  clearStoredData () {
    this.setState({
      datasetName: '',
      query: ''
    })
    this.storeDataset('')
    this.storeQuery('')
  }

  render () {
    const { apiKey, datasetName, query, queryType } = this.state
    const dataset = datasetName ? `https://data.world/${datasetName}` : null

    if (! this.isTableau) {
      return (<NotTableauView />)
    }

    return (
      (apiKey ? <TableauConnectorForm
        connector={connector}
        dataset={dataset}
        apiKey={apiKey}
        clearStoredData={this.clearStoredData}
        clearApiKey={this.clearApiKey}
        query={query}
        queryType={queryType} />
        : <div/>)
    )
  }
}

export default App
