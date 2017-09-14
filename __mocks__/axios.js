import Promise from 'promise'

let mockResponse = {}

const __setMockResponse = (responseData) => {
  mockResponse.data = responseData
}

const __rejectNext = () => {
  mockResponse.reject = true
}

const post = () => {
  return new Promise((resolve, reject) => {
    if (mockResponse.reject) {
      mockResponse.reject = false
      reject()
    } else {
      resolve(mockResponse)
    }
  })
}

export default {
  __setMockResponse,
  __rejectNext,
  post,
  defaults: {
    headers: {
      common: {},
      post: {}
    }
  }
}