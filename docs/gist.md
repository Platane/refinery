# Gist

Let's build a refinery app example.

## Declare fragment

Fragment are pure functions. Values computed by this functions compose the global state of the app.  

Let's declare three of them with different behaviors.

### Computed from action

This fragment value is set by an action.

```javascript
const pattern = action =>
    action.payload.pattern

pattern.actions = [ 'setPattern' ]
```

This fragment will react to actions with type `'pattern:set'` and take the value passed as payload.


### Computed from action and previous state

This fragment value depends of the previous value.

```javascript
const wordList = ( action, list ) =>
    [ ...list, action.payload.word ]

wordList.actions = [ 'newWord' ]
wordList.initValue = []
```

The first argument is the action. Notice that this time we will use the second one, which is the value returned at the last update.

> As you may guess, at init the value is set to [] with the `initValue` property.

This fragment takes the item passed as payload and push it to the list.

> Note that the returned value is a new array. Refinery use == to detect change.

### Computed from other fragments

This fragment value will be computed from the values of other fragments.

```javascript
const matchingWords = ( wordList, pattern ) =>
    matchingWords.filter( word => word.includes( pattern ) )

matchingWords.dependencies = [ wordList, pattern ]
```

As this fragment did not declare action to listen, the first argument is not an action. Instead, it gets the value of the fragments declared as dependencies.

> Every time an action change one of the dependencies value, this fragment will be updated.


## Create the dispatcher

Now it's time to build the reducer and have the dispatcher ready to use.

```javascript
import create from 'refinery-js'

const {dispatch, register} = create( { pattern, wordList, matchingWords } )
```

Refinery will expose function to alter the state, register callback to change and access values.

```javascript
const callback = words =>
    console.log(`Those words contains the pattern : ${ words.join() }`)

register( matchingWords, callback )
```

```javascript
dispatch( { type : 'newWord', payload : { word : 'dinosaure' } } )
```
