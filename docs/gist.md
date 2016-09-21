# Gist

Let's build a refinery app example.


```javascript

/**
 * The application is describeb with fragments.
 * Each fragment is responsible to manage an atomic part of the state.
 * It is a pure function which takes as input  an action / values of other fragments ( or both ) and output the new value.
 *
 * After an action, fragment are updated in cascade, composing the new state.
 */


// This fragment will react to actions with type 'pattern:set'
// and take the value passed as payload.
const pattern = action =>
    action.payload.pattern

pattern.actions = [ 'setPattern' ]


// This fragment output value depends of his previous value.
// which is passed as second arguments
const wordList = ( action, list ) =>
    [ ...list, action.payload.word ]

wordList.actions = [ 'newWord' ]
wordList.initValue = []         


// This fragment value will be computed from the values of other fragments.
const matchingWords = ( wordList, pattern ) =>
    matchingWords.filter( word => word.includes( pattern ) )

matchingWords.dependencies = [ wordList, pattern ]



// create the reducer
import create from 'refinery-js'

const {dispatch, register, getValue} = create( { pattern, wordList, matchingWords } )


// return the current value of the fragment
console.log(`The pattern is ${ getValue( pattern ) }`)


// register listener to change
const callback = words =>
    console.log(`Those words contains the pattern : ${ words.join() }`)

register( matchingWords, callback )


// dispatch an action to change the state
dispatch( { type : 'newWord', payload : { word : 'dinosaure' } } )

```
