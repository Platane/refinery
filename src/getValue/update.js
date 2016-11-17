
import call             from '../dispatcher/call'

// if needed, update the fragment ( first propage the update to outdated dependencies )
// modify state, and outdated object
const update = ( fragment_by_name, name, state, outdated ) => {

    const fragment = fragment_by_name[ name ]

    if ( !outdated[ name ] )
        return

    let outdatedDependency = null
    while( outdatedDependency = fragment.dependencies.find( name => outdated[ name ] ) )
        update( fragment_by_name, outdatedDependency, state, outdated )

    const action        = null
    const previousState = {}

    const oldValue  = state[ name ]
    const newValue  = call( fragment, action, state, previousState )

    if ( fragment.equal ? !fragment.equal( newValue, oldValue ) : newValue != oldValue )
        state[name] = newValue

    outdated[ name ] = false
}

module.exports = update
