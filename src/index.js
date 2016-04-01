

const extractFrags = register => {


    // push all the frags into this array
    const frags = []
    const registerFn = ( fn, ...rest ) => {

        const actions       = ( rest[0] && typeof rest[0][0] == 'string' && rest[0] ) || ( rest[1] && typeof rest[1][0] == 'string' && rest[1] ) || []
        const dependencies  = ( rest[0] && typeof rest[0][0] == 'function' && rest[0] ) || ( rest[1] && typeof rest[1][0] == 'function' && rest[1] ) || []

        frags.push({ fn, actions, dependencies })

        return fn
    }

    const tree = register( registerFn )

    // name all the frags
    const traverse = ( tree, path=[] ) =>
        typeof tree == 'function'
            ? frags.find( x => x.fn == tree ).path = path
            : Object.keys( tree ).forEach( name => traverse( tree[ name ], [ ...path, name ] ) )

    traverse( tree )

    return frags
}


export const createGraph = ( register ) => {

    const frags = extractFrags( register )


}

export const _test = { extractFrags }
