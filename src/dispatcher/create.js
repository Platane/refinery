
import call             from './call'
import computeNewState  from './computeNewState'



const createSourceGetter = fragment_by_name => {

    const by_action        = {}
    let all   = Object.keys( fragment_by_name )
        .filter( name => fragment_by_name[name].allActions )
        .map( name => fragment_by_name[name] )

    Object.keys( fragment_by_name )
        .forEach( name =>
            fragment_by_name[name].actions.forEach( action => {

                if( !by_action[ action ] )
                    by_action[ action ] = all.slice()

                by_action[ action ].push( fragment_by_name[name] )
            })
        )

    Object.keys( by_action )
        .forEach( action =>  by_action[ action ] = by_action[ action ].sort( (a,b) => a.index > b.index ? 1 : -1 ) )

    all = all.sort( (a,b) => a.index > b.index ? 1 : -1 )

    return actionType =>
        actionType in by_action
            ? by_action[ actionType ]
            : all
}


const createDispatcher = ( fragment_by_name, state, hooks ) => {

    const getSources = createSourceGetter( fragment_by_name )


    const dispatch = action => {

        const oldState = state.current
        const { state:newState, outdated, changed } = computeNewState( fragment_by_name, state.current, action, getSources( action.type ) )

        // notify listeners
        const listeners = [].concat( ...changed.map( name => fragment_by_name[ name ].listeners ) )
            .filter( (a,i,arr) => arr.indexOf( a ) == i )

        listeners.forEach( listener => {
            const args = listener.fragments.map( name => newState[ name ] )
            try{
                listener.callback.apply( null, args )
            } catch( err ){
                console.error( `error while executing registred handler for the fragment ${ listener.fragments.join(', ') } for the event ${ action.type }`, err )
            }
        })


        state.current  = newState
        state.previous = oldState
        state.outdated = { ...state.outdated, ...outdated }


        // hook
        hooks && hooks.forEach( fn => fn( action, state ) )
    }


    let dispatching     = false
    let doLaterStack    = []
    const safeDispatch = action => {

        // queue the action if currently dispatching
        if ( dispatching ) {
            if ( doLaterStack.length > 50 )
                throw 'dispatch called repeatedly'
            else
                return doLaterStack.push( action )
        }

        dispatching = true
        dispatch( action )
        dispatching = false

        // unqueue the action
        while( doLaterStack.length )
            safeDispatch( doLaterStack.shift() )

    }

    return { dispatch : safeDispatch }
}

module.exports = createDispatcher
