# refinery

[![wercker status](https://app.wercker.com/status/3a608cdb76a067bfc05325268a54401d/s/master "wercker status")](https://app.wercker.com/project/byKey/3a608cdb76a067bfc05325268a54401d)
[![dependency status](https://img.shields.io/david/Platane/refinery.svg?style=flat-square)](https://david-dm.org/platane/refinery)
[![code coverage](https://img.shields.io/coveralls/Platane/refinery.svg?style=flat-square)](https://coveralls.io/repos/109857)
[![npm version](https://img.shields.io/npm/v/refinery-js.svg?style=flat-square)](https://www.npmjs.com/package/refinery-js)

Reactive Redux reducer

Let you build your application state as small reducer with dependency relations.

# usage


```javascript

// fragment the state, declare a reducer for each

// this fragment is updated when an action is dispatched
const A = ( action, a = 0 ) => {
    if ( 'A:increment' == action.type )
        return a + 1
    
    else
        return a
}
A.source    = true

// this one too
const B = ( action, b = 0 ) => {
    if ( 'B:increment' == action.type )
        return b + 1
    
    else
        return b
}
B.source    = true

// this fragment depends on others, it is updated when the dependencies change
const sum => ( a, b ) =>
    a + b
sum.dependencies = [ A, B ]
```

```javascript

// usage with redux

import createReducer     from 'refinery-js'
import { createStore }   from 'redux'

// create the reducer from the fragments
const { reduce, initState } = createReducer( { A, B, sum } )

// create redux store
const store = createStore( reduce, initState )

store.dispatch({type:'A:increment'})

store.getState()
// {
//      A   : 1
//      B   : 0
//      sum : 1
// }

```
