const errorHandler = (error, fetch) => {
  if (fetch.onError != null) {
    if (typeof fetch.onError === 'function') {
      return fetch.onError(error)
    }
    throw new Error(`'onError' must be a valid function`)
  }
  return null
}

export default errorHandler
