const responseHandler = (response, fetch) => {
  if (fetch.onSuccess != null) {
    if (typeof fetch.onSuccess === 'function') {
      return fetch.onSuccess(response)
    }
    throw new Error(`'onSuccess' must be a valid function`)
  }
  return null
}

export default responseHandler
