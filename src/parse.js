



const parseFragmentDefinition = ( definition, path ) => {

    const name = path.join('.')

    if ( definition.actions && definition.actions != 'all' && ( !Array.isArray( definition.actions ) || definition.actions.some( action => typeof action != 'string') ) ){
        console.warn('definitions.action should be either \'all\' or a array containing actions type as string')
        throw new  Error('unexpected fragment definition')
    }
    const actions    = Array.isArray( definition.actions ) ? definition.actions : []
    const allActions = definition.allActions || definition.actions == 'all'

    if ( ( definition.stateless || definition.projector ) && ( actions.length || allActions )  ){
        console.warn('a stateless fragment can not react to an action')
        throw new  Error('unexpected fragment definition')
    }
    const stateless = !!definition.stateless
    const cold      = stateless

    const fragment = {
        update          : definition.update || definition,
        equal           : definition.equal,
        nexts           : [],
        dependencies    : [],
        listeners       : [],
        cold            : null,
        name,
        stateless,
        definition,
        actions,

        index               : null,
        extractDependencies : null,
    }

    if ( 'initValue' in definition )
        fragment.initValue = definition.initValue

    fragment.extractDependencies = ( fragment_by_name, fragmentTree ) =>

        ( ( typeof definition.dependencies == 'function' && definition.dependencies( fragmentTree ) ) || definition.dependencies || [] )
            .map( nameOrDefinition =>  {

                let dependencyName

                if ( typeof nameOrDefinition == 'string' ) {

                    if ( !fragment_by_name[ nameOrDefinition ] ){
                        console.warn('invalid fragment definition, '+nameOrDefinition+' does not exist')
                        throw new  Error('unexpected fragment definition')
                    }

                    dependencyName = nameOrDefinition

                } else {

                    dependencyName = Object.keys( fragment_by_name ).find( name => fragment_by_name[name].definition == nameOrDefinition )

                    if ( !dependencyName ){
                        console.warn('invalid fragment definition, dependency is not in the fragment tree')
                        throw new  Error('unexpected fragment definition')
                    }
                }

                fragment_by_name[ name ].dependencies.push( dependencyName )
                fragment_by_name[ dependencyName ].nexts.push( name )

            })



    return fragment
}


const isFragmentDefinition = node =>
    typeof node == 'function' || ( node.update && typeof node.update == 'function' )


const parseFragmentTree = ( node, path = [] ) =>
    isFragmentDefinition( node )
        ? [ parseFragmentDefinition( node, path ) ]
        : [].concat(
            ...Object.keys( node ).map( key => parseFragmentTree( node[key], [ ...path, key ] ) )
        )

module.exports = { parseFragmentTree }
