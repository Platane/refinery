import sortDependencies 	   from './sort'



const isReducer = o =>
    ( 'function' == typeof o ) || o.reduce

const parseReducer = o =>
    ({
        reduce      : o.reduce || o,
        name        : null,
        index       : null,
        y           : null,
        dependencies: [],
        derivations : [],
        source      : !!o.source,
        stateless   : !!( o.stateless && !o.source ),
        _ref        : o,
    })

//return an array of parsed reducer, with names corresponding to the path concatened
const parseReducerTree = ( tree ) =>
        isReducer( tree )

            // leaf, parse the reducer
            ? [ { ...parseReducer( tree ) } ]

            // not, iterate throught children, concat and return the results
            : [].concat(
                ...Object.keys( tree )
                    .map( key =>
                        parseReducerTree( tree[ key ] )
                            .map( r =>
                                ({
                                    ...r,
                                    name    : key + ( r.name ? '.'+r.name : '' ),
                                })
                            )
                    )
            )


// modify the array in place,
// add dependencies and derivations
const parseDependencies = ( reducerList ) =>
    reducerList.forEach( reducer =>

        ( reducer._ref.dependencies || [] )
            .forEach( (d,i) => {

                // r can be either the name or the reference
                const dependency = reducerList.find( u => u.name == d || u._ref == d )

                if ( !dependency )
                    throw new Error(`the reducer ${ reducer.name } declare an undefined dependency at position ${i}`)

                reducer.dependencies.push( dependency )
                dependency.derivations.push( reducer )
            })
    )


module.exports  = (reducerTree = {}) => {

    const reducerList = parseReducerTree( reducerTree )

    parseDependencies( reducerList )

    sortDependencies( reducerList )

    return reducerList
}

