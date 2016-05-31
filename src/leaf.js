
export const createRegister = ( storage ) => {

    const register = (...args) => {
        const by_id = storage.by_id()
        const fn = args.pop()
        const dependencies = args.map( key => storage.getId( key ) )
        const pack = {fn, dependencies}

        if ( dependencies.some( id => !by_id[ id ] || !by_id[ id ].leafs ) ) {
            console.warn( 'trying to register change to undefined fragment', dependencies.map( id => by_id[ id ] ), args )
            throw 'trying to register change to undefined fragment'
        }

        dependencies.forEach( id => by_id[ id ].leafs.push(pack) )
    }
    const unregister = fn =>
        storage.list().forEach( ({leafs}) => {
            for(let i=leafs.length; i--;)
                if(leafs[i].fn == fn)
                    leafs.splice(i,1)
        })

    return { register, unregister }
}
