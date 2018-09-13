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

import Raven from 'raven-js'
import React, { Component } from 'react'
import DatasetSelector from './DatasetSelector'
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
import Icon from './Icon'
import * as utils from '../util'

const datasetRegex = /^https?:\/\/data\.world\/(.+\/.+)$/

class TableauConnectorForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataset: this.props.dataset || '',
      errorMessage: '',
      isSubmitting: false,
      query: this.props.query || '',
      queryType: this.props.queryType || 'sql',
      showDatasetSelector: false,
      writingQuery: !!this.props.query
    }
  }

  datasetChanged (e) {
    const dataset = e.target.value.toLowerCase()
    this.setState({dataset})
  }

  queryChanged (e) {
    const query = e.target.value
    this.setState({query})
  }

  queryTypeChanged (e) {
    const queryType = e.target.value
    this.setState({queryType})
  }

  isDatasetValid () {
    return this.state.dataset && datasetRegex.test(this.state.dataset)
  }

  showDatasetSelector () {
    analytics.track('tableauconnector.dataset_selector.click')
    this.setState({showDatasetSelector: true})
  }

  selectDataset (dataset) {
    this.setState({
      dataset: `https://data.world/${dataset.owner}/${dataset.id}`,
      showDatasetSelector: false
    })
  }

  onSubmit (e) {
    utils.log('START: Submit')
    analytics.track('tableauconnector.form.submit')
    e.preventDefault()

    if (!this.isDatasetValid()) {
      return this.setState({
        isError: true
      })
    }

    this.setState({
      isSubmitting: true,
      isError: false
    })

    this.props.connector.setConnectionData(
      this.state.dataset.match(datasetRegex)[1],
      this.state.query,
      this.state.queryType)

    this.props.connector.validateParams().then(() => {
      this.props.connector.submit()
      this.setState({
        dataset: '',
        query: '',
        queryType: ''
      })
      utils.log('SUCCESS: Submit')
    }).catch((error) => {
      Raven.captureException(error)
      this.setState({
        isSubmitting: false,
        isError: true,
        errorMessage: error.message || (error.response && error.response.data)
      })
      utils.log('FAILURE: Submit')
    })
  }

  supportLinkClick () {
    analytics.track('tableauconnector.form.support.click')
  }

  render () {
    const {
      dataset,
      query,
      queryType,
      isSubmitting,
      isError,
      writingQuery,
      errorMessage,
      showDatasetSelector
    } = this.state

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
            <form onSubmit={e => this.onSubmit(e)}>
              {isError && <Alert bsStyle='danger'>
                <strong>
                  {!errorMessage && <span>All fields are required. {errorMessage}</span>}
                  {errorMessage && <span>{errorMessage}</span>}
                </strong>
              </Alert>}
              <FormGroup validationState={datasetValidState}>
                <ControlLabel>Dataset URL</ControlLabel>
                <InputGroup>
                  <FormControl
                    onChange={e => this.datasetChanged(e)}
                    value={dataset}
                    autoFocus
                    disabled={writingQuery}
                    type='text'
                    placeholder='http://data.world/jonloyens/an-intro-to-dataworld-dataset' />
                  {!writingQuery &&
                  <InputGroup.Button>
                    <Button onClick={() => this.showDatasetSelector()} className='button-addon-with-icon'>
                      <Icon icon='browse' />
                      Browse
                    </Button>
                  </InputGroup.Button>}
                </InputGroup>
                {datasetValidState === 'warning' && <HelpBlock>A valid dataset URL is required:
                  https://data.world/jonloyens/an-intro-to-dataworld-dataset</HelpBlock>}
                {datasetValidState === 'success' && <HelpBlock>Dataset URL valid</HelpBlock>}
                {!datasetValidState && <HelpBlock>Copy and paste the dataset URL or click "Browse"</HelpBlock>}
              </FormGroup>
              {writingQuery &&
              <div>
                <FormGroup>
                  <ControlLabel>Query Type</ControlLabel>
                  <InputGroup>
                    <FormControl
                      value={queryType}
                      onChange={e => this.queryTypeChanged(e)}
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
                      onChange={e => this.queryChanged(e)}
                      value={query}
                      componentClass='textarea'
                      placeholder='SELECT * FROM TABLE_NAME' />
                  </InputGroup>
                </FormGroup>
              </div>}
              <Button
                className='center-block'
                type='submit'
                disabled={isSubmitting || datasetValidState !== 'success'}
                bsStyle='primary'>Connect</Button>
              <div className='footer'>
                <a href='https://help.data.world/hc/en-us/articles/115010298907-Tableau-Web-Data-Connector'
                  target='_blank' onClick={this.supportLinkClick}>Learn more about the data.world connector</a>
              </div>
            </form>
          </Col>
        </Row>
        <DatasetSelector
          show={showDatasetSelector}
          close={() => this.setState({showDatasetSelector: false})}
          selectDataset={dataset => this.selectDataset(dataset)} />
      </Grid>
    )
  }
}

TableauConnectorForm.propTypes = {
  connector: PropTypes.any,
  dataset: PropTypes.string,
  query: PropTypes.string,
  queryType: PropTypes.string
}

export default TableauConnectorForm
