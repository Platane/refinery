Gist
====

Let's build a refinery app example.


```javascript

// This fragment of state hold the pattern
// The value passed with the action 'setPattern'
const pattern = ( action, previousPattern = '' ) => {
    
    if ( 'setPattern' == action.type )
        return action.payload.pattern
        
    else
        return previousPattern
        
// The line below describe the fact that the reducer should be called when an action is dispatched
pattern.source = true


// This fragment have the same behavior, it store all the word passed with the action 'newWord' in an array
const wordList = ( action, list = [] ) => {
    
    if ( 'newWord' == action.type )
        return [ ...list, action.payload.word ]
    
    else
        return list
}

wordList.source = true


// This fragment is derivated from others.
// The value will be computed from the values of other fragments.
const matchingWords = ( wordList, pattern ) =>
    matchingWords.filter( word => word.includes( pattern ) )

// The line below define the fragment dependencies
matchingWords.dependencies = [ wordList, pattern ]


// create the reducer from the fragments

import create           from 'refinery-js'

const { reduce, initState } = create( { pattern, wordList, matchingWords } )

// the reduce function can be used with redux

import { createStore }  from 'redux'

const store = createStore( reduce, initState )


store.dispatch({ type : 'newWord', payload : { word : 'dinosaure' } })
store.dispatch({ type : 'setPattern', payload : { pattern : 'di' } })

store.getState()
// {
//      pattern         : 'di'
//      wordList        : [ 'dinosaure' ]
//      matchingWords   : [ 'dinosaure']
// }

```
