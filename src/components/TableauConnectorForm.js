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
import PropTypes from 'prop-types'
import './TableauConnectorForm.css'
import {
  Alert,
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  HelpBlock,
  InputGroup,
  Row
} from 'react-bootstrap'
import sparkle from '../static/img/new-sparkle-logo.png'
import analytics from '../analytics'

const datasetRegex = /^https?:\/\/data\.world\/(.+\/.+)$/
class TableauConnectorForm extends Component {

  static propTypes = {
    connector: PropTypes.any,
    dataset: PropTypes.string,
    apiKey: PropTypes.string,
    query: PropTypes.string,
    queryType: PropTypes.string,
    clearApiKey: PropTypes.func,
    clearStoredData: PropTypes.func
  }

  state = {
    dataset: this.props.dataset || '',
    apiToken: this.props.apiKey || '',
    query: this.props.query || '',
    queryType: this.props.queryType || 'sql',
    writingQuery: !!this.props.query,
    isSubmitting: false,
    errorMessage: ''
  }

  componentDidMount = () => {
    if (this.props.apiKey) {
      analytics.identify(this.props.apiKey)
    }
  }

  datasetChanged = (e) => {
    const dataset = e.target.value.toLowerCase()
    this.setState({ dataset })
  }

  queryChanged = (e) => {
    const query = e.target.value
    this.setState({ query })
  }

  queryTypeChanged = (e) => {
    const queryType = e.target.value
    this.setState({ queryType })
  }

  isDatasetValid = () => {
    return this.state.dataset && datasetRegex.test(this.state.dataset)
  }

  onSubmit = (e) => {
    analytics.track('tableauconnector.form.submit')
    e.preventDefault()

    if (!this.isDatasetValid()) {
      return this.setState({
        isError: true
      })
    }

    if (this.state.query) {
      return this.onQuery(e)
    }

    this.setState({
      isSubmitting: true,
      isError: false
    })
    this.props.connector.setConnectionData(this.state.dataset.match(datasetRegex)[1], this.state.apiToken)
    this.props.connector.verify().then(() => {
      this.props.connector.submit()
      this.props.clearStoredData();
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        return this.props.clearApiKey()
      }
      this.setState({
        isSubmitting: false,
        isError: true,
        errorMessage: error.response && error.response.data
      })
    })
  }

  onQuery = (e) => {
    if (!this.state.query) {
      this.setState({
        isError: true
      })
    } else {
      this.setState({
        isSubmitting: true,
        isError: false
      })
      this.props.connector.setConnectionData(this.state.dataset.match(datasetRegex)[1], this.state.apiToken, this.state.query, this.state.queryType)
      this.props.connector.verify().then(() => {
        this.props.connector.submit()
        this.props.clearStoredData();
      }).catch((error) => {
        if (error.response && error.response.status === 401) {
          return this.props.clearApiKey()
        } else {
          this.setState({
            isSubmitting: false,
            isError: true,
            errorMessage: error.response && error.response.data
          })
        }
      })
    }
  }

  supportLinkClick = () => {
    analytics.track('tableauconnector.form.support.click')
  }

  render () {
    const { dataset, isSubmitting, isError, writingQuery, errorMessage } = this.state

    let datasetValidState

    if (dataset) {
      datasetValidState = this.isDatasetValid() ? 'success' : 'warning'
    }

    return (
      <Grid className={writingQuery ? 'query main' : 'main'}>
        <Row className='center-block'>
          <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
            <img src={sparkle} className='header-image' alt='data.world sparkle logo' />
            <h2 className='header'>Add a data source from data.world</h2>
            <form onSubmit={this.onSubmit}>
              {isError && <Alert bsStyle='danger'>
                <strong>
                  {!errorMessage && <span>All fields are required.</span>}
                  {errorMessage && <span>{errorMessage}</span>}
                </strong>
              </Alert>}
              <FormGroup validationState={datasetValidState}>
                <ControlLabel>Dataset</ControlLabel>
                <InputGroup>
                  <FormControl
                    onChange={this.datasetChanged}
                    value={this.state.dataset}
                    autoFocus
                    type='text'
                    placeholder='http://data.world/jonloyens/an-intro-to-dataworld-dataset' />
                </InputGroup>
                {datasetValidState === 'warning' && <HelpBlock>A valid dataset URL is required: https://data.world/jonloyens/an-intro-to-dataworld-dataset</HelpBlock>}
                {datasetValidState === 'success' && <HelpBlock>Dataset URL valid</HelpBlock>}
                {!datasetValidState && <HelpBlock>Copy and paste the dataset URL here</HelpBlock>}
              </FormGroup>
              {writingQuery && <div><FormGroup>
                <ControlLabel>Query Type</ControlLabel>
                <InputGroup>
                  <FormControl
                    value={this.state.queryType}
                    onChange={this.queryTypeChanged}
                    componentClass='select'
                    placeholder='Select'>
                    <option value='sql'>SQL</option>
                    <option value='sparql'>SPARQL</option>
                  </FormControl>
                </InputGroup>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Query</ControlLabel>
                  <InputGroup>
                    <FormControl
                      onChange={this.queryChanged}
                      value={this.state.query}
                      componentClass='textarea'
                      placeholder='SELECT * FROM TABLE_NAME' />
                  </InputGroup>
                </FormGroup></div>}
              <Button
                className='center-block'
                type='submit'
                disabled={isSubmitting || datasetValidState !== 'success'}
                bsStyle='primary'>Submit</Button>
              <div className='footer'>
                <a href='https://datadotworld.zendesk.com/hc/en-us/articles/115010298907-Tableau-Web-Data-Connector' target='_blank' onClick={this.supportLinkClick}>Learn more about the data.world connector</a>
              </div>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default TableauConnectorForm
