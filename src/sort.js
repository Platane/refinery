
const filterInPlace = ( arr, test ) => {
    for ( let i=arr.length; i--; )
        if ( !test( arr[i] ) )
            arr.splice( i, 1 )
    return arr
}

const sort = reducerList => {

    const graph = {}
    reducerList
        .forEach( reducer => graph[ reducer.name ] = reducer.dependencies.slice() )

    const list = reducerList.slice()

    let y      = 0

    while( list.length ){

        // get all the reducer without dependencies in the list on remaining fragments
        const sources = list.filter( ({ name }) => graph[ name ].length == 0 )

        if ( sources.length == 0 )
            throw new Error('cylclical dependencies')

        // attribues y to the fragment in this batch arbitrarily
        sources.forEach( reducer => reducer.y = y )

        // remove the sources from the remaining fragments
        filterInPlace( list, a => !sources.some( b => a.name == b.name ) )

        // remove the soruces from the remaining fragments dependencies
        list.forEach( ({ name }) =>
            filterInPlace( graph[ name ], a => !sources.some( b => a.name == b.name ) )
        )

        y ++
    }

    // alter the list
    reducerList.sort( (a,b) => a.y > b.y ? 1 : -1 )

    // and the derivations list for each reducer
    reducerList.forEach( reducer => {
        reducer.derivations.sort( (a,b) => a.y > b.y ? 1 : -1 )
    })
}

module.exports = sort
