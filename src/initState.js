import call             from './dispatcher/call'

const initState = ( fragment_by_name ) => {

    const list = Object.keys( fragment_by_name )
        .map( name => fragment_by_name[ name ] )
        .sort( (a,b) => a.index > b.index ? 1 : -1 )

    const action = { type: '@@init' }

    const state = {}
    list
        .forEach( fragment => {

            let value

            if ( fragment.cold )
                value = null

            else if ( 'initValue' in fragment )
                value = fragment.initValue

            else
                value = call( fragment, action, state, state )

            state[ fragment.name ] = value
        })

    return state
}

module.exports = { initState }
