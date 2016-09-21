
/**
 *
 * flag the fragment as not cold
 * and to propage to the dependencies
 *
 */
const warm = ( fragment_by_name, name ) => {

    const fragment = fragment_by_name[ name ]

    if( !fragment.cold )
        return

    fragment.cold = false
    fragment.dependencies.forEach( name => warm( fragment_by_name, name ) )
}

/**
 *
 * try to flag the fragment as cold,
 * and to propage to the dependencies
 *
 */
const cold = ( fragment_by_name, name ) => {

    const fragment = fragment_by_name[ name ]

    if( fragment.cold )
        return

    if( !fragment.stateless || fragment.nexts.some( name => !fragment_by_name[ name ].cold ) )
        return

    fragment.cold = true
    fragment.dependencies.forEach( name => cold( fragment_by_name, name ) )
}

const createRegister = ( fragment_by_name, state ) => {

    const fragment_list = Object.keys( fragment_by_name ).map( name => fragment_by_name[name] )
    const getFragmentByDefinition = definition =>
        fragment_list.find( fragment => fragment.definition == definition )


    const register = ( ...args ) => {

        const fragments = args.slice(0,-1).map( nameOrDefinition => fragment_by_name[ nameOrDefinition ] || getFragmentByDefinition( nameOrDefinition ) )
        const callback  = args[ args.length-1 ]

        const r = { callback, fragments: fragments.map( fragment => fragment.name ) }

        fragments.forEach( fragment => {
            warm( fragment_by_name, fragment.name )

            fragment.listeners.push(r)
        })
    }

    const unregister = ( callback ) =>

        fragment_list
            .forEach( fragment => {

                const i = fragment.listeners.findIndex( x => x.callback = callback )

                if ( i < 0 )
                    return

                fragment.listeners.splice( i, 1 )

                cold( fragment_by_name, fragment.name )
            })

    return { register, unregister }
}

module.exports = createRegister
