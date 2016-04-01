/**
 *
 * /!\ side effect on graph
 *
 * @param graph
 *         graph[ A ][ i ] = B
 *   <=>   A is predecessor of B
 *   <=>   B is successor of A
 *   <=>   A should be before B
 *
 * @return Number[]
 *      [ A, B, C ... ]  A should be before B, B should be before C ...
 *
 */
const sort = ( graph ) => {

    const res = []

    // all the node X without predecessors   <=>   there is no node Y such as Y -> X
    const freeNode = []

    // fill freeNode
    for ( let X =graph.length; X--; ){
        let Y
        for ( Y = graph.length; Y-- && graph[ Y ].indexOf( X ) == -1 ; )
            ;

        if ( Y == -1 )
            freeNode.push( X )
    }

    while ( freeNode.length ) {

        const A = freeNode.shift()
        res.push( A )

        // for each node B with      A -> B
        // remove this node from the graph ( as A is remove from the graph )
        graph[ A ].length = 0


        // search for new freeNode
        for ( let X =graph.length; X--; ){

            if ( freeNode.indexOf( X ) == -1 && res.indexOf( X ) == -1 ) {

                let Y
                for ( Y = graph.length; Y-- && graph[ Y ].indexOf( X ) == -1 ; )
                    ;

                if ( Y == -1 )
                    freeNode.push( X )
            }
        }

    }

    if( res.length < graph.length )
        throw 'cyclical graph'

    return res
}


export default sort
