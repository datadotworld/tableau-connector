import React, { Component } from 'react'
import {Col, Grid} from 'react-bootstrap'
import './NotTableauView.css'
import analytics from '../analytics'

import sparkle from '../static/img/new-sparkle-logo.png'

class NotTableauView extends Component {

  supportLinkClick = () => {
    analytics.track('tableauconnector.nottableauview.support.click')
  }

  render () {
    return (
      <Grid className='notTableauView'>
        <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
          <img src={sparkle} alt='data.world sparkle logo'/>
          <h2>
          Welcome to data.world''s Tableau web data connector.
          </h2>
          <p>Open this page from Tableau version 10 or greater to connect a dataset.</p>
          <a href='https://datadotworld.zendesk.com/hc/en-us/articles/115010298907-Tableau-Web-Data-Connector' target='_blank' onClick={this.supportLinkClick}>Learn more about the data.world connector</a>
        </Col>
      </Grid>
    )
  }
}

export default NotTableauView
