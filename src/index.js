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

    const reducerList   = parse( reducerTree )

    const sources       = reducerList.filter( x => x.source )


    const reduce        = ( previousState, action ) => {

        const toUpdate  = sources.slice()
        const newState  = { ...previousState }

        while ( toUpdate.length ) {

            const reducer = toUpdate.shift()

            const newValue = call( previousState, newState, action, reducer )

            if ( newValue == previousState[ reducer.name ] )
                continue

            newState[ reducer.name ] = newValue

            sortedMerge( toUpdate, eliminateDuplicate( reducer.derivations, toUpdate ) )
        }

        return newState
    }

    const initAction   = { type:'@@init/refinery' }
    const initState    = {}
    reducerList.forEach( reducer =>

        initState[ reducer.name ] = 'initValue' in reducer

            ? reducer.initValue

            : call( {}, initState, initAction, reducer )

    )

    return { reduce, initState }
}

module.exports = create

