import {createFragmentStorage, sort, extract, linkDependencies}   from './storage'
import {createDispatch}   from './dispatch'
import {createRegister}   from './leaf'


export const create = fragmentTree => {

    const storage = createFragmentStorage()
    extract( storage, fragmentTree )
    linkDependencies( storage )
    sort( storage )


    const state = {}


    return {
        dispatch: createDispatch( storage, state ),
        ...createRegister( storage ),

        getValue: ( key ) => state.current[ storage.getId( key ) ],

        list: () => storage.sortedList(),
        by_id: () => storage.by_id(),
    }
}
