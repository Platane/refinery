

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
const callFragment = ( fragment, action, state, previousState ) =>
    fragment.fn(

        // the action ( if the function have registred action )
        ...( fragment.source ? [action] : [] ),

        // the dependencies registred values, in the same order
        ...fragment.dependencies.map( id => state[ id ] ),

        // the previous state
        ...( fragment.projector ? [] : [ state[ fragment.id ] ] ),

        // function to access special values in store
        ...( fragment.projector ? [] : fragment.dependencies.map( id => previousState[ id ] ) )
    )

/**
 *
 * for each fragment, compute the initValue,
 *   which is either    - set from the initValue param
 *                      - computed with the action '@@init'
 *                      - computed from the dependencies
 *
 */
const initValues = ( fragmentList, initState ) => {

    const state = initState || {}
    const initAction = {type:'@@init'}

    // init all the values with actions
    fragmentList
        .filter( ({id}) => !(id in state ) )
        .forEach( x =>
            state[ x.id ] = 'initValue' in x.definition
                    ? x.definition.initValue
                    : callFragment( x, initAction, state, {} )
        )

    return state
}

const dispatch = ( fragment_by_id, action, previousState, sources ) => {

    const newState = { ...previousState }

    let leafs = []
    const mayChange = sources.slice()

    while( mayChange.length ) {

        // grab the first one ( the one with lower index )
        const c = mayChange.shift()

        // call the function
        const value = callFragment( c, action, newState, previousState )

        // check if the value have changed
        if ( value == previousState[c.id] )
            continue

        newState[ c.id ] = value

        // the value have changed,
        // should notify the leafs
        leafs.push( ...c.leafs )

        // and propage the change
        mergePendingFrags( mayChange, c.next.map( i => fragment_by_id[i] ) )
    }

    // eliminate leaf duplication
    leafs = leafs
        .filter( (x,i,arr) => arr.indexOf( x ) == i )


    return { newState, leafs }
}

/**
 * create a function which return the sorted list of fragment source for a given action
 *
 */
const getSourceFactory = fragmentList => {

    const by_action = {}
    let all = fragmentList
        .filter( x => x.definition.allAction )

    fragmentList
        .filter( x => !x.definition.allAction && x.definition.actions )
        .forEach( x => x.definition.actions
            .forEach( actionType  =>
                ( by_action[ actionType ] = by_action[ actionType ] || all.slice() ).push( x )
            )
        )

    all = all.sort( (a, b) => a.index < b.index ? 1 : -1 )

    for( let actionType in by_action )
        by_action[ actionType ] = by_action[ actionType ].sort( (a, b) => a.index < b.index ? 1 : -1 )

    return actionType =>
        actionType in by_action
            ? by_action[ actionType ]
            : all
}

export const createDispatch = ( fragment_list, fragment_by_id, state, hooks ) => {

    const getSources = getSourceFactory( fragment_list )

    state.current = initValues( fragment_list, state.current )

    let dispatching = false
    const doLaterStack = []

    const safeDispatch = ( action ) => {

        // queue the action if currently dispatching
        if ( dispatching ) {
            if ( doLaterStack.length > 50 )
                throw 'dispatch called repeatedly'
            else
                return doLaterStack.push( action )
        }


        dispatching = true

        // compute the new state,
        // and notify the leafs
        const {newState, leafs} = dispatch( fragment_by_id, action, state.current, getSources( action.type ) )


        const previousState = state.current

        // loop
        state.current = newState

        // notify leafs
        leafs.forEach( leaf =>
            leaf.fn( ...leaf.dependencies.map( id => newState[ id ] ) )
        )

        // hook
        hooks && hooks.forEach( fn => fn( action, previousState, newState ) )

        dispatching = false

        // unqueue the action
        while( doLaterStack.length )
            safeDispatch( doLaterStack.shift() )
    }

    return safeDispatch
}
