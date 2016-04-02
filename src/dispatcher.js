

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

export const createDispatcher = ( fragments, by_actions, state ) => {

    state.current = state.current || {}

    return ( action ) => {

        const previousState = state.current
        const newState = { ...previousState }

        let frags = by_actions[ action.type ] || []
        let leafs = new Set

        while( frags.length ) {

            // grab the first one ( the one with lower index )
            const f = frags.shift()


            // prepare params
            const depValues     = f.dependencies
                .map( frag => newState[ frag.literalPath ] )

            const previousDepValues  = f.dependencies
                .map( frag => previousState[ frag.literalPath ] )

            const previousValue = previousState[ f.literalPath ]

            // call the function
            const value = f.actions.length
                ? f( action, ...depValues, previousValue, ...previousDepValues )
                : f( ...depValues, previousValue, ...previousDepValues )

            // check if the value have changed
            if ( value == previousValue )
                continue

            newState[ f.literalPath ] = value

            // the value have changed,
            // should notify the leafs
            f.leafs
                .forEach( l => leafs.add( l ) )

            // and propage the change
            mergePendingFrags( frags, f.next )
        }

        // notify the leafs
        leafs
            .forEach( l =>

                l( ...l.dependencies.map( frag => newState[ frag.literalPath ] ) )

            )

        // loop
        state.current = newState
    }
}
