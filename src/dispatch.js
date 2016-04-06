

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

const sortByAction = ( storage ) => {

    const by_actions = {}
    storage.sortedList().forEach( x =>
        x.actions.forEach( actionType =>
            ( by_actions[ actionType ] = by_actions[ actionType ] || [] ).push( x.id )
        )
    )

    return by_actions
}

const sortIdArr = ( storage, arr ) => {
    const by_id = storage.by_id()
    return arr.sort( (a_id, b_id) => by_id[ a_id ].index > by_id[ b_id ].index ? 1 : -1 )
}

const callFragment = ( fragment, action, state, getValue, getPreviousValue ) =>
    fragment.fn(
        ...( fragment.actions.length ? [action] : [] ),
        ...fragment.dependencies.map( id => state[ id ] ),
        state[ fragment.id ],
        getValue,
        getPreviousValue
    )


const initValues = ( storage, initState ) => {

    const state = initState || {}
    const initAction = {type:'@@init'}

    // init all the values with actions
    storage.sortedList()
        .filter( ({id}) => !(id in state ) )
        .forEach( x =>
            state[ x.id ] = 'defaultValue' in x.definition
                ? x.definition.defaultValue
                : callFragment( x, initAction, state, key => state[ storage.getId(key) ], () => null )
        )

    return state
}

export const createDispatch = ( storage, state ) => {

    const by_actions = sortByAction( storage )


    // sort all the next array
    storage.list().forEach( x => x.next = sortIdArr( storage, x.next ) )

    state.current = initValues( storage, state.init )

    return ( action ) => {

        const previousState = state.current
        const newState = { ...previousState }

        const by_id = storage.by_id()
        const getValue = key => newState[ storage.getId( key ) ]
        const getPreviousValue = key => previousState[ storage.getId( key ) ]

        let mayChange = ( by_actions[ action.type ] || [] ).map( i => by_id[ i ] )
        let leafs = []

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

        // loop
        state.current = newState
    }
}
