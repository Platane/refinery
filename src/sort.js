
/**
 *
 * asssuming fragment_by_name contains named object with a filed 'dependencies' which contains dependencies as name
 *
 * set the index attribute on the fragments
 *
 */
const sort = ( fragment_by_name ) => {

    const graph = {}
    Object.keys( fragment_by_name )
        .forEach( name => graph[name] = fragment_by_name[ name ].dependencies.slice() )

    let list = Object.keys( graph )

    let index       = 0
    const stepSize  = 1000

    while( list.length ){

        // get all the fragment without dependencies in the list on remaining fragments
        const sources = list.filter( name => graph[ name ].length == 0 )

        if ( sources.length == 0 )
            throw new Error('cylclical dependencies')

        // attribues index to the fragment in this batch arbitrarily
        sources.forEach( name => fragment_by_name[ name ].index = index = index+1 )

        // remove the sources from the remaining fragments
        list = list.filter( name => !sources.some( n => name == n ) )

        // remove the soruces from the remaining fragments dependencies
        list.forEach( name =>
            graph[ name ] = graph[ name ].filter( dep_name => !sources.some( source_name => source_name == dep_name ) )
        )

        // just to emphaze the number of steps max
        index += 1000
    }
}

module.exports = { sort }
