# refinery


[![build status](https://img.shields.io/travis/Platane/refinery.svg?style=flat-square)](https://travis-ci.org/Platane/refinery)
[![dependency status](https://img.shields.io/david/Platane/refinery.svg?style=flat-square)](https://david-dm.org/platane/refinery)
[![code coverage](https://img.shields.io/coveralls/Platane/refinery.svg?style=flat-square)](https://coveralls.io/repos/109857)

Flux graph based implementation


# usage


```javascript

// declare store fragments

// this fragment is updated when an action is dispatched
const A = ( action, x ) =>
    x ++
A.actions = [ 'A:increment' ]
A.initValue = 0

// this one too
const B = ( action, x ) =>
    x ++
B.actions = [ 'B:increment' ]
B.initValue = 0

// this fragment depends on others, it is updated when the dependencies change
const sum => ( a, b ) =>
    a + b
sum.dependencies = [ A, B ]
```

```javascript
import create            from 'refinery-js'

const {dispatch, getValue, register} = create( { A, B, sum } )

// dispatch the action
dispatch({type:'A:increment'})

// access the value
getValue( sum )

// get notified when the fragment value change
register( sum, ( x ) => console.log(`sum value is now ${x}`) )
```
