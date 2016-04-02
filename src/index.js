import sort                 from './sort'
import {createDispatcher}   from './dispatcher'


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

    // sort the next array in each fragment
    fragments.forEach( frag => frag.next = frag.next.sort( (a,b) => a.index > b.index ? 1 : -1 ) )



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
        register,
        unregister,
        dispatch: createDispatcher( fragments, by_actions, state ),

        getState,
        fragments,
    }
}
