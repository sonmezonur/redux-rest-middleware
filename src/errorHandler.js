const errorHandler = (error, fetch) => {
  if (fetch.onError != null) {
    if (typeof fetch.onError === 'function') {
      return fetch.onError(error)
    }
    throw new Error(`'onError' must be a valid function`)
  }
  const fetchError = fetch.error || {}
  const details = `Fails: '${fetch.method}' to the source '${fetch.endpoint}'`
  return {
    ...fetchError,
    details: details,
    error: error
  }
}

export default errorHandler
