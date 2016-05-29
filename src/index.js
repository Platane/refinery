import {createFragmentStorage, sort, extract, linkDependencies}   from './storage'
import {createDispatch}   from './dispatch'
import {createRegister}   from './leaf'

const flatten = (object, path=[]) =>
    typeof object != 'object'
        ? { [ path.join('.') ]: object }
        : Object.keys( object )
            .reduce( (flat, key) => ({ ...flat, ...flatten( object[ key], [...path, key] ) })  ,{} )

export const create = (fragmentTree, initialState) => {

    const storage = createFragmentStorage()
    extract( storage, fragmentTree )
    linkDependencies( storage )
    sort( storage )

    const state = {current: initialState && flatten(initialState) }

    const hooks = []

    return {
        dispatch: createDispatch( storage.sortedList(), storage.by_id() , state, hooks ),
        ...createRegister( storage ),

        getValue: ( key ) => state.current[ storage.getId( key ) ],
        getState: () => state.current,

        list: () => storage.sortedList(),
        by_id: () => storage.by_id(),

        hook: fn => hooks.push( fn ),
    }
}
