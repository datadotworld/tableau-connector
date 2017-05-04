import Promise from 'promise'

let mockResponse = {}

const __setMockResponse = (responseData) => {
  mockResponse.data = responseData
}

const get = () => {
  return new Promise(function (resolve) {
    resolve(mockResponse)
  })
}

export default {
  __setMockResponse,
  get
}