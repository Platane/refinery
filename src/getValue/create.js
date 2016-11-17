
import update             from './update'


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

            update( fragment_by_name, name, newState, state.outdated )

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
