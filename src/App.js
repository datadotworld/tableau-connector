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
import axios from 'axios';

const tableau = window.tableau
const connector = new TableauConnector()

class App extends Component {

  constructor () {
    super()
    this.oauthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID
    this.oauthRedirectURI = process.env.REACT_APP_OAUTH_REDIRECT_URI

    this.parsedQueryString = queryString.parse(location.search)
    let { dataset_name, query, queryType, token, code } = this.parsedQueryString
    console.log('This is the query string', this.parsedQueryString);

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
    this.isTableau = window.tableauVersionBootstrap || this.parsedQueryString.forceTableau || true
    const apiKey = this.getApiKey()

    if (!apiKey && this.isTableau && !code) {
      this.redirectToAuth()
    }

    if (code) {
      console.log('This is the code', code)
      var base = 'https://data.world/oauth/access_token'
      var cod = `code=${code}&`
      var id = 'client_id=xx&'
      var secret = 'client_secret=x&'
      var type = 'grant_type=authorization_code&'
      var verifier = 'code_verifier=7226B60BF83752C66A6C19529096151164E4C492DBD8371AFD93E5AE69364E76'
      console.log('This is the other one', base+cod+id+secret+type+verifier)

      axios.post(base, {
        code: code,
        client_id: 'xx',
        client_secret: 'x',
        grant_type: 'authorization_code',
        code_verifier: '7226B60BF83752C66A6C19529096151164E4C492DBD8371AFD93E5AE69364E76'
        // redirect_uri: 'http://localhost:3000/fin'
      })
      .then(function (response) {
        console.log('This is the response', response);
        window.location = `http:localhost:3000/?token=${response.data.access_token}`
      })
      .catch(function (error) {
        console.log('This is the error', error);
      });
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
    var base = 'https://data.world/oauth/authorize?'
    var id = 'client_id=tableau-native-dev&'
    var redirect = 'redirect_uri=http://localhost:3000/callback&'
    var type = 'response_type=code&'
    var method = 'code_challenge_method=plain&'
    var challenge = 'code_challenge=7226B60BF83752C66A6C19529096151164E4C492DBD8371AFD93E5AE69364E76'
    console.log('This is the one', base + id + redirect + type + method + challenge)
    window.location = base + id + redirect + type + method + challenge;
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
