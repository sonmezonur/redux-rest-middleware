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

  request(requestType, endpoint, data, params) {

    if (!(requestType instanceof String || typeof(requestType) === 'string')) {
      throw new Error('Request type must be string')
    }

    if (!supportedRequestTypes.includes(requestType)) {
      throw new Error('Unsupported request type')
    }

    const url = constructTargetURL(
      this.baseURL, 
      endpoint, 
      {
        ...this.params,
        ...params
      }
    )
    let fn
    if (requestTypesWithBody.includes(requestType)) {
      // pass data to it
      fn = fetch(url, {
        method: requestType,
        headers: this.headers,
        body: data
      })
    } else {
      // wait response of fetch call
      fn = fetch(url, {
        headers: this.headers
      })
    }

    return fn.then(
      (response) => Promise.resolve(response.json()),
      (error) => Promise.reject(error)
    )
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