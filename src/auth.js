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
import Raven from 'raven-js'
import * as api from './api'
import crypto from 'crypto'
import uuidv1 from 'uuid/v1'
import * as utils from './util.js'

const refreshTokenKey = 'DW-REFRESH-TOKEN-KEY'
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

const storeRefreshToken = (refreshToken) => {
  if (window.localStorage) {
    window.localStorage.setItem(refreshTokenKey, refreshToken)

    if (window.tableau) {
      window.tableau.password = refreshToken
    }
    return refreshToken
  }
  return null
}

const getRefreshToken = (useTableauPassword = false) => {
  if (window.localStorage) {
    let refreshToken = window.localStorage.getItem(refreshTokenKey)
    if (window.tableau && useTableauPassword) {
      refreshToken = window.tableau.password || refreshToken
    }
    return refreshToken
  }
  return null
}

const getAccessToken = async (useTableauPassword = false) => {
  const refreshToken = getRefreshToken(useTableauPassword)
  if (refreshToken) {
    // exchange refresh token for access token
    try {
      const response = await api.getRefreshedTokens(refreshToken)
      // store new refresh token
      storeRefreshToken(response.data.refresh_token)
      return response.data.access_token
    } catch (error) {
      Raven.captureException(error)
      utils.log(`ERROR : Failed to refresh tokens - ${error.message}`)
      return null
    }
  }
  return null
}

const getStateObject = (key) => {
  let state = key // The key here is the state value from auth url.
  if (window.localStorage) {
    const stringifiedState = window.localStorage.getItem(key)
    state = stringifiedState || state
  }
  return JSON.parse(state)
}

const storeStateObject = (state) => {
  if (window.localStorage) {
    const key = uuidv1()
    const stringifiedState = JSON.stringify(state)
    window.localStorage.setItem(key, stringifiedState)
    return key
  }
  return JSON.stringify(state)
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

const exchangeCodeForTokens = (code) => {
  return api.exchangeCodeForTokens(code, useCodeVerifier()).then(response => {
    let refreshToken = ''
    let accessToken = ''
    if (response.data) {
      refreshToken = response.data.refresh_token
      accessToken = response.data.access_token
    }
    storeRefreshToken(refreshToken)
    return Promise.resolve({accessToken, refreshToken})
  })
}

export { redirectToAuth, exchangeCodeForTokens, getAccessToken, storeRefreshToken, getRefreshToken, getStateObject }
