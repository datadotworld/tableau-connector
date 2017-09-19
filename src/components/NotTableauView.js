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
          Welcome to data.world's Tableau web data connector.
          </h2>
          <p>Open this page from Tableau version 10 or greater to connect a dataset.</p>
          <a href='https://help.data.world/hc/en-us/articles/115010298907-Tableau-Web-Data-Connector' target='_blank' onClick={this.supportLinkClick}>Learn more about the data.world connector</a>
        </Col>
      </Grid>
    )
  }
}

export default NotTableauView
