

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

export const createDispatcher = ( fragmentList, by_actions, state ) => {

    state.current = state.current || {}

    return ( action ) => {

        const previousState = state.current
        const newState = { ...previousState }

        let mayChange = ( by_actions[ action.type ] || [] ).map( i => fragmentList[ i ] )
        let leafs = []

        while( mayChange.length ) {

            // grab the first one ( the one with lower index )
            const c = mayChange.shift()


            // prepare params
            const depValues     = c.dependencies
                .map( x => newState[ x.literalPath ] )

            const previousDepValues  = c.dependencies
                .map( x => previousState[ x.literalPath ] )

            const previousValue = previousState[ c.literalPath ]

            // call the function
            const value = c.actions.length
                ? c.fn( action, ...depValues, previousValue, ...previousDepValues )
                : c.fn( ...depValues, previousValue, ...previousDepValues )

            // check if the value have changed
            if ( value == previousValue )
                continue

            newState[ c.literalPath ] = value

            // the value have changed,
            // should notify the leafs
            leafs = [ ...leafs, ...c.leafs ]

            // and propage the change
            mergePendingFrags( mayChange, c.next.map( i => fragmentList[i] ) )
        }

        // notify the leafs
        leafs
            .filter( (x,i,arr) => arr.indexOf( x ) == i )
            .forEach( l =>

                l( ...l.dependencies.map( x => newState[ x.literalPath ] ) )

            )

        // loop
        state.current = newState
    }
}
