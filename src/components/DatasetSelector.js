/*
 * Copyright 2018 data.world, Inc.
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

class DatasetSelector extends Component {

  componentDidMount () {
    const datasetSelector = new window.dataworldWidgets.DatasetSelector({
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      hideViewButton: true
    })

    datasetSelector.success((datasets) => {
      this.props.selectDataset(datasets && datasets.length && datasets[0])
    })

    datasetSelector.cancel(() => {
      this.props.close()
    })

    if (this.props.show) {
      datasetSelector.show()
    }

    this.datasetSelector = datasetSelector
  }

  componentWillUnmount () {
    this.datasetSelector.close()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.show && !this.props.show) {
      this.datasetSelector.show()
    } else if (!nextProps.show) {
      this.datasetSelector.close()
    }
  }

  render () {
    return (<div />)
  }
}

DatasetSelector.propTypes = {
  close: PropTypes.func,
  selectDataset: PropTypes.func,
  show: PropTypes.bool
}

export default DatasetSelector
