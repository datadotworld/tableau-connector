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
import * as api from './api'
import crypto from 'crypto'
import uuidv1 from 'uuid/v1'

const apiTokenKey = 'DW-API-KEY'
const codeVerifierKey = 'DW-CODE-VERIFIER'

const generateCodeVerifier = () => {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '1234567890'
  const specialCharacters = '-._~'
  const characters = lowerCase + upperCase + numbers + specialCharacters

  const minLength = 43
  const maxLength = 128
  const stringLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  let codeVerifier = ''
  for (let i = 0; i < stringLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    codeVerifier += characters.charAt(randomIndex)
  }

  return codeVerifier
}

const getApiKey = (useTableauPassword = false) => {
  if (window.localStorage) {
    let apiKey = window.localStorage.getItem(apiTokenKey)
    if (window.tableau && useTableauPassword) {
      apiKey = window.tableau.password || apiKey
    }
    return apiKey
  }
  return null
}

const storeApiKey = (key) => {
  if (window.localStorage) {
    window.localStorage.setItem(apiTokenKey, key)

    if (window.tableau) {
      window.tableau.password = key
    }
    return key
  }
  return null
}

const getStateObject = (state) => {
  if (window.localStorage) {
    const stringifiedState = window.localStorage.getItem(state)
    state = stringifiedState ? JSON.parse(stringifiedState) : state
  }
  return state
}

const storeStateObject = (state) => {
  const stringifiedState = JSON.stringify(state)
  if (window.localStorage) {
    const key = uuidv1()
    window.localStorage.setItem(key, stringifiedState)
    return key
  }
  return stringifiedState
}

const storeCodeVerifier = (codeVerifier) => {
  if (window.localStorage) {
    window.localStorage.setItem(codeVerifierKey, codeVerifier)
    return codeVerifier
  }
  return null
}

const useCodeVerifier = () => {
  if (window.localStorage) {
    const codeVerifier = window.localStorage.getItem(codeVerifierKey)
    window.localStorage.removeItem(codeVerifierKey)
    return codeVerifier
  }
  return null
}

const generateCodeChallenge = (codeVerifier) => {
  const base64hash = crypto.createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
  return encodeURIComponent(base64hash)
}

const getAuthUrl = (codeVerifier, state) => {
  const codeChallenge = generateCodeChallenge(codeVerifier)
  const nonce = storeStateObject(state)
  return `https://data.world/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}` +
    `&redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URI}` +
    `&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}` +
    `&state=${encodeURIComponent(nonce)}`
}

const redirectToAuth = (state) => {
  const codeVerifier = storeCodeVerifier(generateCodeVerifier())
  window.location = getAuthUrl(codeVerifier, state)
}

const getToken = (code) => {
  return api.getToken(code, useCodeVerifier()).then(response => {
    let token = ''
    if (response.data.access_token) {
      token = response.data.access_token
    }
    return storeApiKey(token)
  })
}

export { redirectToAuth, getToken, getApiKey, storeApiKey, getStateObject }
