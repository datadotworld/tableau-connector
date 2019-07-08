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

import axios from 'axios'
import * as queryString from 'query-string'
import { getApiKey, storeApiKey } from './auth'

const basePath = process.env.REACT_APP_PUBLIC_API_BASE || 'https://api.data.world/v0'
const basePathQuery = process.env.REACT_APP_SPARQL_PROXY_BASE || 'https://query.data.world'
const baseSite = process.env.REACT_APP_BASE_SITE || 'https://data.world'

axios.defaults.headers['Accept'] = 'application/json'
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      storeApiKey('')
    }
    return Promise.reject(error)
  })

const runQuery = (dataset, query, queryType = 'sql') => {
  return axios.post(
    `${basePathQuery}/${queryType}/${dataset}`,
    queryString.stringify({query}),
    {
      headers: {
        'authorization': `Bearer ${getApiKey(true)}`,
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
}

const getToken = (code, code_verifier) => {
  return axios.post(`${baseSite}/oauth/access_token`, {
    code,
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code_verifier
  })
}

const getUser = () => {
  return axios.get(
    `${basePath}/user`,
    {
      headers: {
        'authorization': `Bearer ${getApiKey(true)}`
      }
    })
}

export {
  runQuery,
  getToken,
  getUser
}
