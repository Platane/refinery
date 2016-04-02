import sort from './sort'


const sort_by_actions = fragments => {

    // build the list of fragments which can change by action
    const by_actions = {}
    fragments.forEach( frag =>

        frag.actions.forEach( actionName =>

            ( by_actions[ actionName ] = by_actions[ actionName ] || [] ).push( frag )

        )
    )

    // and special case for the init actions
    by_actions[ '@@init' ] = []
    fragments.forEach( frag =>

        frag.actions.length
            && by_actions[ '@@init' ].push( frag )

    )

    return by_actions
}

const set_next = fragments =>
    fragments.forEach( A =>
        ( A.dependencies || [] )
            .forEach( B => B.next.push( A )  )
    )

const createDispatch = ( fragments, by_actions, state ) => {

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
            frags.push( ...f.next.filter( x => frags.indexOf( x ) == -1 ) )
            frags.sort( (a, b) => a.index < b.index ? 1 : -1 )
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

export const create = fragmentTree => {

    // flatten the fragments into a Set
    const fragments = new Set

    const traverse = ( tree, path=[] ) => {

        if ( typeof tree == 'function' ) {

            // add attributes

            tree.literalPath    = path.join('.')
            tree.path           = path

            // the leafs which listen to change on this fragment
            tree.leafs          = new Set

            // the next fragments ( = fragments for which this is a dependancy )
            tree.next           = []

            // as the fragment can be sorted by resolution priority, the index in this list
            tree.index          = null

            tree.actions        = tree.actions || []
            tree.dependencies   = tree.dependencies || []

            fragments.add( tree )

        } else
            Object.keys( tree )
                .forEach( name => traverse( tree[name],  [...path, name ] ) )
    }

    traverse( fragmentTree )

    // attribute the next field
    set_next( fragments )

    // attribute the index field
    sort( fragments )

    // sort by actions
    const by_actions = sort_by_actions( fragments )

    const state = {}



    // methods
    const register = ( ...args ) => {
        const fn = args.pop()
        fn.dependencies = args
        args.forEach( frag => frag.leafs.add( fn ) )
    }
    const unregister = fn =>
        fragments.forEach( frag => frag.leafs.delete( fn ) )
    const getState = () =>
        state.current


    return {
        getState,
        register,
        unregister,
        fragments,
        dispatch: createDispatch( fragments, by_actions, state )
    }
}
