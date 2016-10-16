import call             from './call'

/**
 *
 * merge a in b,
 *   keep a sorted ( by the attribute "index")
 *
 */
const sortedMerge = ( a, b ) => {

    let ia = 0
    let ib = 0
    while( ib < b.length ){

        if( ia >= a.length )
            a.push( b[ib ++ ] )

        else {
            if ( a[ia].index > b[ib].index )
                a.splice( ia, 0, b[ib ++] )

            else if ( a[ia].index == b[ib].index )
                ib++
        }

        ia++
    }
}


const computeNewState = ( fragment_by_name, state, action, sources ) => {

    const outdated      = {}

    const oldState      = state
    const newState      = { ...state }

    const changed       = []
    const toUpdate      = sources.slice()

    while( toUpdate.length ){

        const fragment  = toUpdate.shift()

        outdated[fragment.name] = false

        // compute new value
        const oldValue  = oldState[ fragment.name ]
        const newValue  = call( fragment, action, newState, oldState )

        // compare to old value, detect change
        if ( fragment.equal ? !fragment.equal( newValue, oldValue ) : newValue != oldValue ){

            newState[ fragment.name ] = newValue

            changed.push( fragment.name )

            // update the fragment that have this one as dependency
            // not the ones tagged as cold
            sortedMerge( toUpdate, fragment.nexts.filter( name => !fragment_by_name[name].cold ).map( name => fragment_by_name[name] ) )

            // update the list of outdated fragment
            fragment.nexts
                .filter( name => fragment_by_name[name].cold )
                .forEach( name => outdated[name] = true )

        }
    }

    // propage outdated
    const toOutdate = Object.keys( outdated )
        .filter( name => outdated[name] )

    while( toOutdate.length ){

        const name = toOutdate.shift()

        fragment_by_name[name].nexts
            .filter( name => !outdated[name] )
            .forEach( name => {
                outdated[name] = true
                toOutdate.push( name )
            })
    }

    return {
        state   : newState,
        changed,
        outdated,
    }
}

module.exports = computeNewState
