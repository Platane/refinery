# october


[![Build Status](https://travis-ci.org/Platane/october.svg?branch=master)](https://travis-ci.org/Platane/october)

Flux graph based implementation

# properties to declare on a fragment
actions
defaultValue
dependencies
path

# spec

file1.js
```javascript
// this is a canonical fragment,
// it react to an action, ( which means it will create state based on the volatile action )
const fragA = ( action, previousState ) => {

    const newState = { ...previousState, change: 1 }

    return newState
}
fragA.source = true

// this is a derivated fragment,
// it react to fragment change
const fragB = ( fragAValue, previousState, previousFragAValue ) => {

    const newState = { ...previousState, u: fragAValue.change+1 }

    return newState
}
fragB.dependencies = [ fragA ]

```

file2.js
```javascript
import {fragB}  from './file1'


// this is also considered as a canonical fragment, as it react to an action an may cristalize action from data into state
// also notice is take a derivated frameng value ( fragment, derivated or not are treated the same way as fragment input )
const fragC = ( action, fragBValue, previousState, previousFragBValue ) => {

    const newState = { ...previousState, u: fragBValue.u+3 }

    return newState
}
fragC.source = true
fragC.dependencies = [ fragB ]
```

file3.js
```javascript
import {fragB}  from './file1'
import {fragC}  from './file1'

// compose fragments
// composing fragments like so will help to have a nice nested structure
// which is not requried at all, expect for cosmetic aspect
export const name = {
    fragB,
    fragC
}
```

fileMain.js
```javascript
import createGraph              from 'october'
import * as fragments           from './file3'


const g = createGraph( fragments )

// register a leaf
const doSomething = ( fragCValue ) =>
    fragCValue
g.register( doSomething, [fragC] )

// dispatch an action
const action = {type:''}
g.dispatch( action )


g.values( fragB )
```
