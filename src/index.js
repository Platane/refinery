import parse    from './parse'

const call      = ( previousState, newState, action, { name, reduce, dependencies, source, stateless } ) => {

    const args = []

    if ( source )
        args.push( action )

    args.push(
        ...dependencies.map( ({ name }) => newState[ name ] )
    )

    if ( !stateless )
        args.push(
            previousState[ name ],
            ...dependencies.map( ({ name }) => previousState[ name ] )
        )

    return reduce( ...args )
}

/**
 *
 * merge a in b,
 *   keep a sorted ( by the attribute "index")
 *
 */
const sortedMerge = ( a, b ) => {

    // traverse simultaneously a and b

    let ia = 0
    let ib = 0
    while( ib < b.length ){

        if( ia >= a.length ){
            // we are at the end of a,
            // b still contains element
            // push then to a
            a.push( b[ ib ] )

            // continue to the next element of b
            ib ++

            // as we add an element on a, put the cursor on it
            ia ++

        } else if ( a[ia].index > b[ib].index ) {
            // the next element of b should be inserted before the next element of a
            a.splice( ia, 0, b[ib] )

            // continue to the next element of b
            ib ++

            // as we add an element on a, put the cursor on it
            ia ++

        } else if ( a[ia].index == b[ib].index ) {
            // as id are unique,
            // the item is already in the a list
            // ignore it
            ib ++

        } else
            ia ++
    }
}

const create    = reducerTree => {

    // the sorted list of reducers
    const reducerList   = parse( reducerTree )

    // reducers which react to actions
    const sources       = reducerList.filter( x => x.source )


    const reduce        = ( previousState, action ) => {

        const toUpdate  = sources.slice()
        const newState  = { ...previousState }

        while ( toUpdate.length ) {

            const reducer = toUpdate.shift()

            const newValue = call( previousState, newState, action, reducer )

            if ( newValue === previousState[ reducer.name ] )
                continue

            newState[ reducer.name ] = newValue

            // propage the update to derivations
            // be careful to conserver the reducer order
            sortedMerge( toUpdate, reducer.derivations )
        }

        return newState
    }

    // notice that redux does kind of the same init job
    // expect that the init will not propage if a dependencies does not changed at init ( = stays null or undefined )
    // this loop will call the reducer no matter if the dependencies change or not to ensure every value is inited
    const initAction   = { type:'@@refinery/INIT' }
    const initState    = {}
    reducerList.forEach( reducer =>
        initState[ reducer.name ] = call( {}, initState, initAction, reducer )
    )

    // alphanumerical sort the fragment name
    // this is helpful for reading the state in redux devTool
    const sortedInitState = {}
    Object.keys(initState)
        .sort( (a, b) => a > b ? 1 : -1 )
        .forEach( key => sortedInitState[key] = initState[key] )

    return { reduce, initState: sortedInitState }
}

module.exports = create

