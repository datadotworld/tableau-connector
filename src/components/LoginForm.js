import React, { Component } from 'react'
import {
  Button,
  Col,  
  Grid,
  Row
} from 'react-bootstrap'

import analytics from '../analytics'
import './LoginForm.css'
import sparkle from '../static/img/new-sparkle-logo.png'

class LoginForm extends Component {

  constructor () {
    super()
    this.oauthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID
    this.oauthRedirectURI = process.env.REACT_APP_OAUTH_REDIRECT_URI
  }

  authenticateButtonClicked = () => {
    analytics.track('tableauconnector.auth_form.auth_button.click')
  }

  render () {
    return (
      <Grid className='loginForm'>
        <Row className='center-block'>
          <Col md={10} mdOffset={1} xs={10} xsOffset={1}>
            <img src={sparkle} className='center-block' alt='data.world sparkle logo' />
            <h3 className='header'>Authenticate with data.world to access your dataset</h3>
            <div className='text-center'>
              <Button
                onClick={this.authenticateButtonClicked}
                href={`https://data.world/oauth/authorize?client_id=${this.oauthClientId}&redirect_uri=${this.oauthRedirectURI}`}
                bsStyle='primary'>Authenticate</Button>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default LoginForm