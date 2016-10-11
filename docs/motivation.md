Motivation
===

I created refinery trying to solve problems I encounter the best way possible. Doing so I was inspired by other libraries and took what I found clever, filling the gap where I felt something was missing.


## Inspiration

Refinery follows the same principle as __Redux__. Which is : whenever something happen a serializable action is dispatched and the new app state is computed with a reducer function. `newState = reducer( action, oldState )`.

> In fact, you can see refinery as a convenient way to write your reducer to pass to the redux store creator. With smarter listeners.


Redux encourage you to break your application state into isolated reducer, which are responsible for only a small piece of the state.

Which is great, but I always find myself having to enlarge the scope of reducer when I have a value that depends on many parts of the state.

Let me explain why I came to develop refinery with an example.

## Example

Let's take an example,

Reducers are composed like this :

```javascript
const state = {
    listA : [],     // updated by reducerA
    listB : [],     // updated by reducerB
}
```

Let says `ReducerA` handles many complex thing, with many actions.
Same thing for `ReducerB`.

```javascript
const reducerA = ( action, previousListA ) => {
    switch( action.type ) {
        //
        // very large switch with complex stuff
        // ...

const reducerB = ( action, previousListB ) => {
    switch( action.type ) {
        //
        // even larger switch, with unrelated to listA, yet complex stuff
        // ...
```

This is a good use of `combineReducers`

```javascript
const reducer = combineReducers( reducerA, reducerB )
```

## Issue

Now let say we need to maintain the sum of all element in listA + listB, and have it in the state.

```javascript
const state = {
    listA : [],
    listB : [],
    sum   : 0,
}
```

We can merge the two reducers, but we don't want to, they are complex enought left alone.

We could probably go with stacking a new layer of reducer, `reducerCount`

```javascript
const reducer = compose( combineReducers( reducerA, reducerB ), reducerCount )
```

```javascript
const reducerCount = ({ listA, listB }) =>
    ({
        listA,
        listB,
        sum : listA.length + listB.length
    })
```

This is acceptable.
However as the application grows it becomes painful to determine by hand which reducer should be called first.

## Solution

This is what refinery do.

You describe the application with dependency relation between piece of state.

```javascript
const sum = ( listA, listB ) =>
    listA.length + listB.length

sum.dependencies = [ listA, listB ]
```

Refinery handles for you to call the update function when needed.

> And other cool stuffs comes for free ! ( specific change listener, lazy evaluation ... )
