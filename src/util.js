import axios from 'axios'
import crypto from 'crypto'

function getCodeVerifier() {
  return window.localStorage.getItem('DW-CODE-VERIFIER')
}

function generateCodeChallenge(codeVerifier) {
  const base64hash = crypto.createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
  return encodeURIComponent(base64hash)
}

export function generateCodeVerifier() {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '1234567890'
  const specialCharacters = "-._~"
  const characters = lowerCase + upperCase + numbers + specialCharacters

  const minLength = 43
  const maxLength = 128
  const stringLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  let codeVerifier = ''
  for (var i = 0; i < stringLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    codeVerifier += characters.charAt(randomIndex)
  }

  return codeVerifier;
}

export function getAuthUrl() {
  const codeVerifier = getCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  return `https://data.world/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URI}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`
}

export function getToken(code) {
  return axios.post('https://data.world/oauth/access_token', {
    code,
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code_verifier: getCodeVerifier()
  });
}
