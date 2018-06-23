// Custom FETCH API wrapper

const appendQueryParams = (url, params) => {
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
}

const combineURLs =  (baseURL, relativeURL) => (
  relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
)

const constructTargetURL = (baseURL, relativeURL, params) => {
  // combine base URL and endpoint
  const combinedURLs = new URL(
    combineURLs(baseURL, relativeURL)
  )

  // append query params to URL
  appendQueryParams(combinedURLs, params)

  return combinedURLs;
}

const requestTypesWithBody = ['POST', 'PUT', 'PATCH']
const supportedRequestTypes = ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']

class Fetch {
  constructor(baseURL, params = {}, headers = {}) {
    this.baseURL = baseURL
    // default query param
    this.params = params
    this.headers = headers
  }

  async request(requestType, endpoint, data, params) {

    if (!(requestType instanceof String || typeof(requestType) === 'string')) {
      throw new Error('Request type must be string')
    }

    if (!supportedRequestTypes.includes(requestType)) {
      throw new Error('Unsupported request type')
    }

    const url = constructTargetURL(
      this.baseURL, 
      endpoint, 
      Object.assign({}, this.params, ...params)
      // pass default params if exists
    )
    let response
    if (requestTypesWithBody.includes(requestType)) {
      // pass data to it
      response = await fetch(url, {
        method: requestType,
        headers: this.headers,
        body: JSON.stringify(data)
      })
    } else {
      // wait response of fetch call
      response =  await fetch(url, {
        headers: this.headers
      })
    }

    const content = await response.json()
    return content
  }

  post(endpoint, data, params = {}) {
    return this.request('POST', endpoint, data, params)
  }

  put(endpoint, data, params = {}) {
    return this.request('PUT', endpoint, data, params)
  }

  patch(endpoint, data, params = {}) {
    return this.request('PATCH', endpoint, data, params)
  }

  delete(endpoint, params = {}) {
    return this.request('DELETE', endpoint, null, params)
  }

  get(endpoint, params = {}) {
    return this.request('GET', endpoint, null, params)
  }
}

export default Fetch