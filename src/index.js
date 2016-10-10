import { parseFragmentTree }    from './parse'
import { sort }                 from './sort'
import { initState }            from './initState'
import { initCold }             from './initCold'
import createDispatcher         from './dispatcher/create'
import createRegister           from './listener/create'
import createValuerGetter       from './getValue/create'

const createStore = ( fragmentTree ) => {

    // extract all the fragment
    let fragment_list           = parseFragmentTree( fragmentTree )
    const fragment_by_name      = {}
    fragment_list.forEach( fragment => fragment_by_name[fragment.name] = fragment )

    // extract the dependencies
    fragment_list.forEach( fragment => fragment.extractDependencies( fragment_by_name, fragmentTree ) )

    // flag as cold the fragment that are
    initCold( fragment_by_name )

    // sort the fragments
    // ( set the index attributes )
    sort( fragment_by_name )

    // init state
    const state = {

        // old the current value for all the fragment, by name
        current         : null,

        // old the previous value for all the fragment, by name
        previous        : null,

        // old which fragment is "outdated" = not updated because of lazy computation, whereas it should have been in the last loop
        outdated        : {},
    }
    state.current       = initState( fragment_by_name )
    state.previous      = { ...state.current }
    state.outdated      = {}
    fragment_list
        .filter( fragment => fragment.cold )
        .forEach( fragment => state.outdated[ fragment.name ] = true )

    // list of callback to call after each new state computation ( for debugging purpose )
    const hooks = []

    return {
        ...createDispatcher( fragment_by_name, state, hooks ),
        ...createRegister( fragment_by_name, state ),
        ...createValuerGetter( fragment_by_name, state ),
        getState        : () => state.current,
        _registerHook   : callback => hooks.push( callback )
    }
}


module.exports = { create : createStore }
