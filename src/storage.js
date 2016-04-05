import kahnSort                 from './sort/kahn'
import {extract as extract_}    from './extract'

export const createFragmentStorage = () => {

    const by_id = {}
    const id_by_key = new Map

    const add = ( x ) => {
        x.next = []
        x.dependencies = []
        x.leafs = []
        by_id[ x.id ] = x
        id_by_key.set( x.key, x.id )
        return x
    }

    return {
        add,
        list        : () => Object.keys( by_id ).map( id => by_id[ id ] ),
        by_id       : () => by_id,
        getId       : key => id_by_key.get( key ),
    }
}

export const linkDependencies = ( storage ) => {
    const by_id = storage.by_id()

    storage.list().forEach( a =>
            (a.definition.dependencies || []).forEach( b_key => {

                const b_id = storage.getId( b_key )

                a.dependencies.push( b_id )
                by_id[ b_id ].next.push( a.id )

            })
        )
}

export const extract = extract_


export const sort = ( storage ) => {

    const list = storage.list()

    const index_by_id = {}
    list.forEach( (x, i) => index_by_id[x.id] = i )

    const graph = list.map( x => x.next.map( id => index_by_id[id] ) )

    kahnSort( graph ).forEach( (element, i) => list[ element ].index = i )
}
