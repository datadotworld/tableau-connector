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
import { getApiKey } from './auth'

const basePath = 'https://api.data.world/v0'
const basePathQuery = 'https://query.data.world'

axios.defaults.headers['Accept'] = 'application/json'

const runSql = (dataset, query) => {
  return axios.post(
    `${basePathQuery}/sql/${dataset}`,
    queryString.stringify({query}),
    {
      headers: {
        'authorization': 'Bearer ' + getApiKey(true),
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
}

const runSparql = (dataset, query) => {
  return axios.post(
    `${basePathQuery}/sparql/${dataset}`,
    queryString.stringify({query}),
    {
      headers: {
        'authorization': 'Bearer ' + getApiKey(true),
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
}

const runQuery = (dataset, query, queryType) => {
  let apiFn = runSql
  if (queryType && queryType === 'sparql') {
    apiFn = runSparql
  }
  return apiFn(dataset, query)
}

const getUser = () => {
  return axios.get(
    `${basePath}/user`,
    {
      headers: {
        'authorization': 'Bearer ' + getApiKey(true)
      }
    })
}

export {
  runQuery,
  runSql,
  runSparql,
  getUser
}
