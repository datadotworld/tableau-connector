import React, { Component } from 'react'
import {Col, Grid} from 'react-bootstrap'
import './NotTableauView.css'

import sparkle from '../static/img/new-sparkle-logo.png'

class NotTableauView extends Component {

  render () {
    return (
      <Grid className='notTableauView'>
        <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
          <img src={sparkle} alt='data.world sparkle logo'/>
          <h2>
          Welcome to data.world's Tableau web data connector.
          </h2>
          <p>Open this page from Tableau Desktop to connect a dataset.</p>
          <a href='https://help.data.world/support/solutions/articles/14000062187-tableau-data-world-data-connector' target='_blank'>Learn more about the data.world connector</a>
        </Col>
      </Grid>
    )
  }
}

export default NotTableauView
