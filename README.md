redux-rest-middleware
---
Fully customizable REST middleware with zero dependency for your redux apps.

Usage
===

- Setting up basic configuration before attaching middleware to redux store

```javascript
import { applyMiddleware, createStore } from 'redux'
import restMiddleware from '@sonmezonur/redux-rest-middleware'

const apiSettings = {
  baseURL: process.env.REQUEST_URL,
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  },
  params: {
    apiKey: process.env.API_KEY
  }
}

const store = createStore(
  reducers, 
  initialState,
  applyMiddleware(restMiddleware(apiSettings))
)
```

- Action

```javascript
const getAction = (id) => {
  return {
    fetch: {
      method: 'GET', // or 'POST', 'PUT', 'DELETE', 'PATCH'
      endpoint: `/actions/${id}`,
      types: {
        request: 'FETCH_ACTION', // must
        success: 'FETCH_ACTION_SUCCESS', // optional
        failure: 'FETCH_ACTION_FAILURE' // optional
      },
      onSuccess: (response) => {
        // handle response on success
      },
      onError: (err) => {
        // handle error
      }
    }
  }
}
```

- Reducer

```javascript
const actionHandler = (state, { type, payload }) => {  
  switch (type) {
    case 'FETCH_ACTION':
      return {
        ...state,
        isFetching: true
      }
    case 'FETCH_ACTION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        payload: payload
      }
    case 'FETCH_ACTION_FAILURE':
      return {
        ...state,
        error: payload
      }
  }
}
```

- Fetch Parameters
  - `method`: Request Type - 'GET', 'DELETE', 'POST', 'PATCH', 'PUT'
  - `endpoint`: Request source
  - `params`: Query params for the request(on JSON format)
  - `types`: Action types - 'request'(must), 'success', 'failure'
  - `onSuccess`: Function to handle successful requests
  - `onFailure`: Function to handle error responses
