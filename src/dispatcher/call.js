

const call = ( fragment, action, state, previousState ) => {

    // build the arguments array
    const args = []

    // first argument is the action ( if applyable )
    if ( fragment.actions.length > 0 || fragment.allActions )
        args.push( action )

    // next are current dependencies state
    for(let i=0;i<fragment.dependencies.length;i++)
        args.push( state[ fragment.dependencies[i] ] )

    if ( !fragment.stateless ){

        // next, the previosu state
        args.push( previousState[ fragment.name ] )

        // next, the previous dependencies state
        for(let i=0;i<fragment.dependencies.length;i++)
            args.push( previousState[ fragment.dependencies[i] ] )

    }

    try{
        return fragment.update.apply( null, args )
    } catch( err ){
        console.error( `error while updating the fragment ${ fragment.name } for the event ${ action.type }`, err, action )
    }
}

module.exports = call
