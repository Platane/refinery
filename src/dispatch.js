

/**
 *
 * merge a in b,
 *   keep a sorted ( by the attribute "index")
 *
 */
const mergePendingFrags = ( a, b ) => {

    let ia = 0
    let ib = 0
    while( ib < b.length ){

        if( ia >= a.length )
            a.push( b[ib ++ ] )

        else {
            if ( a[ia].index > b[ib].index )
                a.splice( ia, 0, b[ib ++] )

            else if ( a[ia].index == b[ib].index )
                ib++
        }

        ia++
    }
}

/**
 *
 * inject dependencies as parameters and call the function
 *
 */
const callFragment = ( fragment, action, state, getValue, getPreviousValue ) =>
    fragment.fn(

        // the action ( if the function have registred action )
        ...( fragment.source ? [action] : [] ),

        // the dependencies registred values, in the same order
        ...fragment.dependencies.map( id => state[ id ] ),

        // the previous state
        state[ fragment.id ],

        // function to access special values in store
        getValue,
        getPreviousValue
    )

/**
 *
 * for each fragment, compute the initValue,
 *   which is either    - computed with the action '@@init'
 *                      - computed from the dependencies
 *
 */
const initValues = ( storage, initState ) => {

    const state = initState || {}
    const initAction = {type:'@@init'}

    // init all the values with actions
    storage.sortedList()
        .filter( ({id}) => !(id in state ) )
        .forEach( x =>
            state[ x.id ] = callFragment( x, initAction, state, key => state[ storage.getId(key) ], () => null )
        )

    return state
}

const dispatch = ( storage, action, previousState, sources ) => {

    const newState = { ...previousState }

    const by_id = storage.by_id()
    const getValue = key => newState[ storage.getId( key ) ]
    const getPreviousValue = key => previousState[ storage.getId( key ) ]

    const leafs = []
    const mayChange = sources.slice()

    while( mayChange.length ) {

        // grab the first one ( the one with lower index )
        const c = mayChange.shift()

        // call the function
        const value = callFragment( c, action, newState, getValue, getPreviousValue )

        // check if the value have changed
        if ( value == previousState[c.id] )
            continue

        newState[ c.id ] = value

        // the value have changed,
        // should notify the leafs
        leafs.push( ...c.leafs )

        // and propage the change
        mergePendingFrags( mayChange, c.next.map( i => by_id[i] ) )
    }

    // notify the leafs
    leafs
        .filter( (x,i,arr) => arr.indexOf( x ) == i )
        .forEach( leaf =>

            leaf.fn( ...leaf.dependencies.map( id => newState[ id ] ) )

        )

    return newState
}

export const createDispatch = ( storage, state, hooks ) => {

    const sources = storage.sortedList()
        .filter( x => x.source )

    state.current = initValues( storage, state.current )

    let dispatching = false
    const doLaterStack = []

    const safeDispatch = ( action ) => {

        // queue the action if currently dispatching
        if ( dispatching ) {
            if ( doLaterStack.length > 50 )
                throw 'stack overflow'
            else
                return doLaterStack.push( action )
        }


        dispatching = true

        // compute the new state,
        // and notify the leafs
        const newState = dispatch( storage, action, state.current, sources )


        const previousState = state.current

        // loop
        state.current = newState

        // hook
        hooks && hooks.forEach( fn => fn( action, previousState, newState ) )

        dispatching = false

        // unqueue the action
        while( doLaterStack.length )
            safeDispatch( doLaterStack.shift() )
    }

    return safeDispatch
}
