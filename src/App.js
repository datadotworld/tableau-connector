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

class App extends Component {
  constructor () {
    super()

    const parsedQueryString = queryString.parse(location.search)

    let {dataset_name, query, queryType, forceTableau} = parsedQueryString
    if (query) {
      queryType = queryType ? queryType.toLowerCase() : 'sql'
    }

    if (parsedQueryString.state) {
      ({dataset_name, query, queryType, forceTableau} = JSON.parse(parsedQueryString.state))
    }

    this.connector = new TableauConnector(
      this.onConnectorReady.bind(this),
      {dataset_name, query, queryType, forceTableau},
      parsedQueryString.code)

    // window.tableauVersionBootstrap is always defined in Tableau environments (desktop/server)
    // parsedQueryString.forceTableau enables debugging on a browser
    this.isTableau = window.tableauVersionBootstrap || forceTableau

    this.state = {
      interactivePhase: false
    }
  }

  onConnectorReady (interactivePhase) {
    this.setState({
      interactivePhase
    })
  }

  render () {
    const {interactivePhase} = this.state
    const {dataset_name, query, queryType} = this.connector.params
    const dataset = dataset_name ? `https://data.world/${dataset_name}` : null

    if (!this.isTableau) {
      return (<NotTableauView />)
    }

    return (
      interactivePhase ? <TableauConnectorForm
        connector={this.connector}
        dataset={dataset}
        query={query}
        queryType={queryType} /> : <div />
    )
  }
}

export default App
