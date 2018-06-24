import Fetch from './fetch'
import errorHandler from './errorHandler'
import responseHandler from './responseHandler'

const defaultOptions = {
  'baseURL': '/',
  'params': {},
  'headers': {}
}

const restMiddleware = (options = defaultOptions) => ({ dispatch, getState }) => next => action => {
  // do nothing if `fetch` action is `undefined`
  const { fetch } = action
  if (fetch == null) {
    return next(action)
  }

  const fetchInstance = new Fetch(
    options.baseURL, // base url
    options.params, // default params
    options.headers // default headers
  )

  // build `async` request
  const asyncRequest = () => (
    fetchInstance.request(
      fetch.method, 
      fetch.endpoint, 
      fetch.data, 
      fetch.params
    )
  )

  const actionTypes = fetchActionTypes(fetch.types)

  dispatch({
    type: actionTypes.request
  })

  return asyncRequest().then(
    (response) => {
      const payload = responseHandler(response, fetch)
      dispatch({
        type: actionTypes.success,
        payload: payload
      })
      return Promise.resolve(getState())
    },
    (error) => {
      const payload = errorHandler(error, fetch)
      dispatch({
        type: actionTypes.failure,
        payload: payload
      })
      return Promise.reject(error)
    }
  )
}


const fetchActionTypes = (types) => {
  if (types == null || types.request == null) {
    throw new Error(`Request type might not be null. 
      'Fetch' middleware must have 'request' type at least.`)
  }
    
  // automatically add 'SUCCESS' type by adding '_SUCCESS' suffix to the request type  
  if (types.success == null) {
    types.success = `${types.request}_SUCCESS`
  }

  // automatically add 'ERROR' type by adding '_FAILURE' suffix to the request type  
  if (types.failure == null) {
    types.failure = `${types.request}_FAILURE`
  }

  return types
}

export default restMiddleware