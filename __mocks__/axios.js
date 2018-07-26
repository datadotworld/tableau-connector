import Promise from 'promise'

const interceptors = {
  response: {}
}
interceptors.response.use = (success, failure) => {
  interceptors.success = success
  interceptors.failure = failure
}

let mockResponse = {}

const __setMockResponse = (responseData) => {
  mockResponse.data = responseData
}

const __rejectNext = () => {
  mockResponse.reject = true
}

const get = () => {
  return new Promise((resolve, reject) => {
    if (mockResponse.reject) {
      mockResponse.reject = false
      reject(interceptors.failure())
    } else {
      resolve(interceptors.success(mockResponse))
    }
  })
}

const post = () => {
  return new Promise((resolve, reject) => {
    if (mockResponse.reject) {
      mockResponse.reject = false
      reject(interceptors.failure())
    } else {
      resolve(interceptors.success(mockResponse))
    }
  })
}

export default {
  __setMockResponse,
  __rejectNext,
  interceptors,
  post,
  get,
  defaults: {
    headers: {
      common: {},
      post: {}
    }
  }
}