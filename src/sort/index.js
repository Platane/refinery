
import sort from './kahn'

/**
 * set the index field on each fragment
 * /!\ side effect
 *
 */
module.exports = ( fragmentSet ) => {

    // graph[ A ][ i ] = B   <=>  A   is a dependancy for B
    // transform to numerical labeled graph
    const graph = Array.apply( null, new Array( fragmentSet.size ))
        .map( _ => [] )

    // attribute a number for each fragment
    let i=0
    const i_by_fragment = new Map
    fragmentSet.forEach( key => i_by_fragment.set( key, i ++ ) )

    // fill the graph
    fragmentSet.forEach( B =>
        B.dependencies.forEach( A =>
            graph[ i_by_fragment.get( A ) ].push( i_by_fragment.get( B ) )
        )
    )

    // sort the graph
    const sorted = sort( graph )

    // fragment by i
    const fragment_by_i = []
    i_by_fragment.forEach( (i, frag) => fragment_by_i[ i ] = frag )

    // attribute the sorted index for each fragment
    sorted.forEach( ( frag_i, index) =>
        fragment_by_i[ frag_i ].index = index
    )
}
