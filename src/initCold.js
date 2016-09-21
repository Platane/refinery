const isCold = ( fragment_by_name, name ) => {

    const fragment = fragment_by_name[ name ]

    if ( fragment.cold === null )
        fragment.cold = fragment.stateless && fragment.nexts.every( name => isCold( fragment_by_name, name ) )

    return fragment.cold
}

/**
 *
 * tag all fragment as cold or not cold
 * a fragment is cold only if all it is stateless and if all the fragment that depends on him are cold 
 *
 */
const initCold = ( fragment_by_name ) =>

    Object.keys( fragment_by_name )
        .forEach( name => isCold( fragment_by_name, name ) )

module.exports = { initCold }
