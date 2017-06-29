import Promise from 'promise'

let mockResponse = {}

const __setMockResponse = (responseData) => {
  mockResponse.data = responseData
}

const post = () => {
  return new Promise(function (resolve) {
    resolve(mockResponse)
  })
}

export default {
  __setMockResponse,
  post,
  defaults: {
    headers: {
      common: {},
      post: {}
    }
  }
}