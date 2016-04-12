import {createFragmentStorage, sort, extract, linkDependencies}   from './storage'
import {createDispatch}   from './dispatch'
import {createRegister}   from './leaf'


export const create = (fragmentTree, initialState) => {

    const storage = createFragmentStorage()
    extract( storage, fragmentTree )
    linkDependencies( storage )
    sort( storage )


    const state = {current: initialState}

    const hooks = []

    return {
        dispatch: createDispatch( storage, state, hooks ),
        ...createRegister( storage ),

        getValue: ( key ) => state.current[ storage.getId( key ) ],

        list: () => storage.sortedList(),
        by_id: () => storage.by_id(),

        hook: fn => hooks.push( fn ),
    }
}
