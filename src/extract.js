
const parseDefinition = ( definition, path ) =>
    ({
        fn      : typeof definition == 'function' && definition || definition.fn,
        id      : definition.id || ( path ? path.join('.') : 'anonym-'+Math.random().toString(36).slice(2,8) ),
        source  : !!definition.source,
        key     : definition,
        definition,
    })



const extractFromDefinition = ( storage, definition, path=[] ) =>
    typeof definition == 'function'
        ? storage.add( parseDefinition( definition, path ) )
        : Object.keys( definition )
            .forEach( name => extractFromDefinition( storage, definition[name], [...path, name] ) )

const extractFromAnonymDependencies = ( storage ) => {

    const list = storage.list()

    const stack = Object.keys( list ).map( id => list[ id ] )

    while( stack.length ) {

        const c = stack.shift()

        ;( c.definition.dependencies || [] )
            .filter( key => !storage.getId( key ) )
            .forEach( definition => stack.push( storage.add( parseDefinition( definition ) ) ) )
    }
}

export const extract = ( storage, fragmentDefinition ) => {

    extractFromDefinition( storage, fragmentDefinition )

    extractFromAnonymDependencies( storage )
}
