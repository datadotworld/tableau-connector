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
import { getAccessToken, storeRefreshToken } from './auth'

const basePath = 'https://api.data.world/v0'
const basePathQuery = 'https://query.data.world'

axios.defaults.headers['Accept'] = 'application/json'
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      storeRefreshToken('')
    }
    return Promise.reject(error)
  })

const runQuery = async (dataset, query, queryType = 'sql') => {
  const accessToken = await getAccessToken(true)
  return axios.post(
    `${basePathQuery}/${queryType}/${dataset}`,
    queryString.stringify({query}),
    {
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
}

const exchangeCodeForTokens = (code, code_verifier) => {
  return axios.post('https://data.world/oauth/access_token', {
    code,
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code_verifier
  })
}

const getUser = async () => {
  const accessToken = await getAccessToken(true)
  return axios.get(
    `${basePath}/user`,
    {
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    })
}

const getRefreshedTokens = (refreshToken) => {
  return axios.post('https://data.world/oauth/access_token', {
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
}

export {
  runQuery,
  exchangeCodeForTokens,
  getUser,
  getRefreshedTokens
}
