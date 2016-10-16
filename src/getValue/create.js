
import call             from '../dispatcher/call'

const compute = ( fragment_by_name, name, action, state, previousState, outdated ) => {

    const fragment = fragment_by_name[ name ]

    if ( !outdated[ name ] )
        return

    let outdatedDependency = null
    while( outdatedDependency = fragment.dependencies.find( name => outdated[ name ] ) )
        compute( fragment_by_name, outdatedDependency, action, state, previousState, outdated )

    const oldValue  = state[ name ]
    const newValue  = call( fragment, action, state, previousState )

    if ( fragment.equal ? !fragment.equal( newValue, oldValue ) : newValue != oldValue )
        state[name] = newValue

    outdated[ name ] = false
}


const createGetValue = ( fragment_by_name, state, hooks ) => {

    const fragment_list = Object.keys( fragment_by_name ).map( name => fragment_by_name[name] )
    const getFragmentByDefinition = definition =>
        fragment_list.find( fragment => fragment.definition == definition )

    const getValue = ( nameOrDefinition ) => {

        const fragment  = fragment_by_name[ nameOrDefinition ] || getFragmentByDefinition( nameOrDefinition )
        const name      = fragment.name

        if ( state.outdated[ name ] ){

            const newState = { ...state.current }
            const action   = { type:'@@lazyUpdate' }

            state.outdated = { ...state.outdated }

            compute( fragment_by_name, name, action, newState, {}, state.outdated )

            state.previous = state.current
            state.current  = newState

            // hook
            hooks && hooks.forEach( fn => fn( action, state ) )
        }

        return state.current[ name ]
    }

    return { getValue }
}

module.exports = createGetValue
