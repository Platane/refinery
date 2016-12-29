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
 *   keep a sorted ( by the attribute "y")
 *
 */
const sortedMerge = ( a, b ) => {

    let ia = 0
    let ib = 0
    while( ib < b.length ){

        if( ia >= a.length )
            a.push( b[ib ++ ] )

        else {
            if ( a[ia].y > b[ib].y )
                a.splice( ia, 0, b[ib ++] )

            else if ( a[ia].y == b[ib].y )
                ib++
        }

        ia++
    }
}

const eliminateDuplicate = ( a, b ) =>
    a.filter( u => !b.some( v => u.name == v.name ) )

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
            sortedMerge( toUpdate, eliminateDuplicate( reducer.derivations, toUpdate ) )
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

    return { reduce, initState }
}

module.exports = create

