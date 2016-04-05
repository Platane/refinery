
import sort from './kahn'

/**
 * set the index field on each fragment
 * /!\ side effect
 *
 */
module.exports = ( fragmentList ) => {

    // graph[ A ][ i ] = B   <=>  A   is a dependancy for B
    const graph = fragmentList
        .map( ({next}) => next.slice() )

    // sort the graph
    const sorted = sort( graph )

    // attribute the sorted index for each fragment
    sorted.forEach( ( i, index ) => fragmentList[ i ].index = index )

    return fragmentList
}
