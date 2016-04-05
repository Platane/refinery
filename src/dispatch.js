

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

    const by_id = storage.by_id()

    const by_actions = {}
    sortIdArr( storage, Object.keys(by_id) ).forEach( id =>

        by_id[ id ].actions.forEach( actionType =>

            ( by_actions[ actionType ] = by_actions[ actionType ] || [] ).push( id )

        )
    )

    return by_actions
}

const sortIdArr = ( storage, arr ) => {
    const by_id = storage.by_id()
    return arr.sort( (a_id, b_id) => by_id[ a_id ].index > by_id[ b_id ].index ? 1 : -1 )
}

export const createDispatch = ( storage, state ) => {

    const by_actions = sortByAction( storage )


    // sort all the next array
    storage.list().forEach( x => x.next = sortIdArr( storage, x.next ) )

    state.current = state.current || {}

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


            // prepare params
            const depValues     = c.dependencies
                .map( id => newState[ id ] )

            const previousValue = previousState[ c.id ]

            // call the function
            const value = c.actions.length
                ? c.fn( action, ...depValues, previousValue, getValue, getPreviousValue )
                : c.fn( ...depValues, previousValue, getValue, getPreviousValue )

            // check if the value have changed
            if ( value == previousValue )
                continue

            newState[ c.id ] = value

            // the value have changed,
            // should notify the leafs
            leafs = [ ...leafs, ...c.leafs ]

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
