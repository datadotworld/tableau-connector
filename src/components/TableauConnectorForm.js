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
    setApiKey: PropTypes.func.isRequired
  }

  state = {
    dataset: this.props.dataset || '',
    apiToken: this.props.apiKey || '',
    isSubmitting: false
  }

  datasetChanged = (e) => {
    const dataset = e.target.value.toLowerCase()
    this.setState({
      dataset
    })
  }

  apiTokenChanged = (e) => {
    const apiToken = e.target.value
    this.setState({
      apiToken
    })
  }

  isDatasetValid = () => {
    return this.state.dataset && datasetRegex.test(this.state.dataset)
  }

  isApiTokenValid = () => {
    return this.state.apiToken && this.state.apiToken.length > 2
  }

  onSubmit = (e) => {
    analytics.track('tableauconnector.form.submit')
    e.preventDefault()
    if (!this.isDatasetValid() || !this.isApiTokenValid()) {
      this.setState({
        isError: true
      })
    } else {
      this.setState({
        isSubmitting: true,
        isError: false
      })
      this.props.setApiKey(this.state.apiToken)
      this.props.connector.setConnectionData(this.state.dataset.match(datasetRegex)[1], this.state.apiToken)
      // this.props.connector.submit()
      this.props.connector.verify().then(() => {
        this.props.connector.submit()
      }).catch(() => {
        this.setState({
          isSubmitting: false,
          isError: true
        })
      })
    }
  }

  supportLinkClick = () => {
    analytics.track('tableauconnector.form.support.click')
  }

  render () {
    const { dataset, apiToken, isSubmitting, isError } = this.state

    let datasetValidState, apiTokenValidState

    if (dataset) {
      datasetValidState = this.isDatasetValid() ? 'success' : 'warning'
    }

    if (apiToken) {
      apiTokenValidState = this.isApiTokenValid() ? 'success' : 'warning'
    }

    return (
      <Grid className='main'>
        <Row className='center-block'>
          <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
            <img src={sparkle} className='center-block' alt='data.world sparkle logo' />
            <form onSubmit={this.onSubmit}>
              <h2 className='header'>Add a data source from data.world</h2>
              {isError && <Alert bsStyle='danger'>
                <strong>
                  All fields are required.
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
                <HelpBlock>Copy and paste the dataset URL here</HelpBlock>
              </FormGroup>
              <FormGroup validationState={apiTokenValidState}>
                <ControlLabel>API Token</ControlLabel>
                <InputGroup>
                  <FormControl
                    type='text'
                    value={this.state.apiToken}
                    onChange={this.apiTokenChanged}
                  />
                </InputGroup>
                <HelpBlock>Find your token at <a href='https://data.world/settings/advanced' target='_blank'>https://data.world/settings/advanced</a>.</HelpBlock>
              </FormGroup>
              <Button
                type='submit'
                className='center-block'
                disabled={isSubmitting}
                bsStyle='primary'>Get Dataset</Button>
              <div className='footer'>
                <a href='https://help.data.world/support/solutions/articles/14000062187-tableau-data-world-data-connector' target='_blank' onClick={this.supportLinkClick}>Learn more about the data.world connector</a>
              </div>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default TableauConnectorForm
