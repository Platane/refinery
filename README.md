# october

Flux graph based implementation

# spec

file1.js
```javascript
// this is a canonical fragment,
// it react to an action, ( which means it will create state based on the volatile action )
const fragA = ( action, previousState ) => {

    const newState = { ...previousState, change: 1 }

    return newState
}

// this is a derivated fragment,
// it react to fragment change
const fragB = ( fragAValue, previousState, previousFragAValue ) => {

    const newState = { ...previousState, u: fragAValue.change+1 }

    return newState
}

const register1 = ( register ) => ({

    fragAName : register( fragA, [ 'actionName' ] ),

    fragBName : register( fragB, [ fragA ] ),

})
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

const register2 = ( register ) => ({

    fragCName : register( fragC, [ 'actionName' ], [ fragB ] ),

})
```


fileMain.js
```javascript
import createGraph              from 'october'
import {register as register1}  from './file1'
import {register as register2}  from './file2'

// compose fragments
// composing fragments like so will help to have a nice nested structure
// which is not useful at all, expect for cosmetic aspect
const registerM = ( register ) => ({
    name1 : register1( register ),
    name2 : register2( register ),
})

const g = createGraph( registerM )

// register a leaf
const doSomething = ( fragCValue ) =>
    fragCValue
g.register( doSomething, [fragC] )

// dispatch an action
const action = {type:''}
g.dispatch( action )


```
