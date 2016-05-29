
const anonymName = () =>
    'anonym-'+Math.random().toString(36).slice(2,8)

const parseDefinition = ( definition, path ) => {

    // defensive check
    if ( !definition ) {
        console.warn(`fragment definition missing for fragment "${path.join('.')}"`)
        throw 'unexpected fragment definition'
    }

    if ( definition.dependencies && definition.dependencies.some( x => 'function' != typeof x ) ) {
        console.warn(`fragment dependencies unexpected for fragment "${path.join('.')}", got dependencies`, definition.dependencies)
        throw 'unexpected fragment definition'
    }

    return {
        fn                  : typeof definition == 'function' && definition,
        id                  : definition.id || ( path ? path.join('.') : anonymName() ),
        projector           : !!definition.projector,
        key                 : definition,
        definition,

        source              : !!( definition.allActions || ( definition.actions && definition.actions.length ) ),
        allActions           : !!definition.allActions,
        actions             : definition.actions
    }
}



const extractFromDefinition = ( storage, definition, path=[] ) =>
    definition === null || typeof definition != 'object'
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
