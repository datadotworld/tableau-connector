import axios from 'axios'

export function getCodeVerifier() {
  return 'lv2oN9ESQYL6w7Y7Y-K1V88zV6mXWBWgPV2DmQWRCjUAM3Trhs'
}

export function getAuthUrl(codeVerifier) {
    const base = 'https://data.world/oauth/authorize?'
    const clientId= `client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&`
    const redirectUri = `redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URI}&`
    const responseType = 'response_type=code&'
    const codeChallengeMethod = 'code_challenge_method=plain&'
    const codeChallenge = `code_challenge=${codeVerifier}`

    return `${base}${clientId}${redirectUri}${responseType}${codeChallengeMethod}${codeChallenge}`
}

export function getToken(code, clientId, clientSecret) {
  return axios.post('https://data.world/oauth/access_token', {
    code,
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code_verifier: getCodeVerifier()
  });
}
