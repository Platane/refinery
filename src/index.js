import sort                 from './sort'
import {createDispatcher}   from './dispatcher'

const fragmentByAction = list => {

    // build the list of fragments which can change by action
    const by_actions = {}
    list.forEach( ({actions}, i) =>
        actions.forEach( actionType =>
            (by_actions[ actionType ] = by_actions[ actionType ] || []).push( i )
        )
    )

    return by_actions
}

const setDependencies = (list, map) =>
    list.forEach( (A,ia) =>
        ( A.key.dependencies || [] )
            .forEach( bkey => {
                const ib = map.get( bkey )
                list[ ib ].next.push( ia )
                A.dependencies.push( ib )
            })
    )

const parseFragment = (fn, path) =>
    ({
        fn,
        path: path || 'anonym'+Math.random().toString(36).slice(2,8),
        actions: fn.actions || [],
        next: [],
        dependencies: [],
        key: fn,
        leafs: [],
    })

const flattenFragments = (tree, path=[]) =>
    typeof tree == 'object'
        ? Object.keys(tree)
            .reduce( (list, name) => [ ...list, ...flattenFragments(tree[name], [...path, name]) ] ,[] )
        : [ parseFragment( tree, path ) ]

const fragmentByKey = fragments =>
    fragments
        .reduce( (map, fragment, i) => map.set( fragment.key, i ), new Map )


const extractAnonymFragments = list => {

    const stack = list.map( x => x.key )

    while (stack.length) {

        const key = stack.shift()

        ;(key.dependencies || [])
            .forEach( key => {

                if ( list.some( x => x.key == key ) )
                    return

                list.push( parseFragment( key ) )
                stack.push( key )
            })
    }

    return list
}

export const create = fragmentTree => {

    // extract fragment from the fragment tree
    const fragmentList = extractAnonymFragments( flattenFragments(fragmentTree) )

    const index = fragmentByKey( fragmentList )

    // attribute the next field
    setDependencies( fragmentList, index )

    // attribute the index field
    sort(fragmentList)

    // sort the next array in each fragment
    fragmentList
        .forEach( x => x.next = x.next.sort((a,b) => fragmentList[a].index > fragmentList[b].index ? 1 : -1))


    // sort by actions
    const by_actions = fragmentByAction( fragmentList )

    const state = {}

    // methods
    const register = (...args) => {
        const fn = args.pop()
        fn.dependencies = args.map( key => index.get( key ) )
        fn.dependencies.forEach( i => fragmentList[ i ].leafs.push(fn) )
    }
    const unregister = fn =>
        fragmentList.forEach( fragment => {
            for(let i=fragment.leafs.length; i--;)
                if(fragment.leafs[i] == fn)
                    fragment.leafs.splice(i,1)
        })
    const value = key =>
        state.current[ key ]
    const fragments = () =>
        fragmentList

    return {
        register,
        unregister,
        dispatch: createDispatcher(fragmentList, by_actions, state),

        value,
        fragments,
    }
}
