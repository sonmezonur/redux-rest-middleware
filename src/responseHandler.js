const responseHandler = (response, fetch) => {
  if (fetch.onSuccess != null) {
    if (typeof fetch.onSuccess === 'function') {
      return fetch.onSuccess(response)
    }
    throw new Error(`'onSuccess' must be a valid function`)
  }
  const fetchResponse = fetch.response || {}
  const details = `Success: '${fetch.method}' request to the source '${fetch.endpoint}'`
  const res = {}
  for (const key of Object.keys(fetchResponse)) {
    // gets value from actual HTTP response 
    const entry = response[fetchResponse[key]]
    if (entry) {
      res[key] = entry
    }
  }

  return {
    ...res,
    details: details
  }
}

export default responseHandler
