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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const browse = <svg className='browse-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
  <path d='M4.273 4.25H.95a.75.75 0 0 0 0 1.5h2.461a5.894 5.894 0 0 1 .862-1.5zM12.95 1.75h-12a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 0 1.5zM4.928 12.25H.95a.75.75 0 0 0 0 1.5h7.221a5.873 5.873 0 0 1-3.243-1.5zM15.781 13.47l-2.862-2.868a4.61 4.61 0 0 0 .88-2.702c0-2.564-2.085-4.65-4.65-4.65S4.5 5.336 4.5 7.9s2.086 4.65 4.65 4.65a4.61 4.61 0 0 0 2.71-.887l2.859 2.866a.746.746 0 0 0 1.06.002.75.75 0 0 0 .002-1.06zM6 7.9c0-1.737 1.413-3.15 3.15-3.15S12.3 6.163 12.3 7.9s-1.413 3.15-3.15 3.15S6 9.637 6 7.9zM3.018 8.25H.95a.75.75 0 0 0 0 1.5h2.351a5.86 5.86 0 0 1-.283-1.5z'/>
</svg>



const ICONS = {
  browse
}

export default class Icon extends Component {

  static propsTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func
  }

  render () {
    const { className, icon, onClick } = this.props
    return (
      <span className={`svg-icon ${className || ''}`} onClick={onClick}>
        {ICONS[icon]}
      </span>
    )
  }
}