import axios from 'axios'

export function getCodeVerifier() {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '1234567890'
  const specialCharacters = "-._~"
  const characters = lowerCase + upperCase + numbers + specialCharacters

  const minLength = 43
  const maxLength = 128
  const stringLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  let string = ''
  for (var i = 0; i < stringLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    string += characters.charAt(randomIndex)
  }

  return string;
}

export function getAuthUrl() {
    const codeVerifier = window.localStorage.getItem('DW-CODE-VERIFIER')
    const base = 'https://data.world/oauth/authorize?'
    const clientId= `client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&`
    const redirectUri = `redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URI}&`
    const responseType = 'response_type=code&'
    const codeChallengeMethod = 'code_challenge_method=plain&'
    const codeChallenge = `code_challenge=${codeVerifier}`

    return `${base}${clientId}${redirectUri}${responseType}${codeChallengeMethod}${codeChallenge}`
}

export function getToken(code) {
  const codeVerifier = window.localStorage.getItem('DW-CODE-VERIFIER')
  return axios.post('https://data.world/oauth/access_token', {
    code,
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier
  });
}
