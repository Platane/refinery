import expect           from 'expect'
import { create }       from '../../../src'


describe('debug methods', function(){

    describe('registerHook', function(){

        it('sould expose the method "_registerHook"', function(){

            const store = create({})

            expect( store._registerHook ).toExist()
        })

        it('sould call the callback after every new state computation', function(){

            const A = ( action, previous ) => previous+1
            A.initValue = 1
            A.actions   = ['aaa']

            const store = create({x:{a:A}})

            let called = false
            store._registerHook( (action, state) => {
                expect( action ).toContain({ type: 'aaa' })

                expect( state.previous ).toEqual({ 'x.a': 1 })
                expect( state.current ).toEqual({ 'x.a': 2 })
                expect( state.outdated ).toEqual({ 'x.a': false })

                called = true
            })

            store.dispatch({type:'aaa'})

            expect( called ).toBe( true )
        })

        it('sould call the callback after a lazy update', function(){

            const A = ( action, previous ) => previous+1
            A.initValue = 1
            A.actions   = ['aaa']

            const B = ( A ) => A+10
            B.dependencies = [ A ]
            B.stateless    = true

            const store = create({x:{a:A},B})

            let stack = []
            store._registerHook( (action, state) => stack.push({ action, state:{ ...state } }) )

            store.dispatch({type:'aaa'})
            store.getValue(B)
            store.dispatch({type:'aaa'})

            expect( stack.length ).toBe( 3 )
            expect( stack[0].action.type ).toBe( 'aaa' )
            expect( stack[0].state.outdated ).toEqual({ 'B': true, 'x.a': false })
            expect( stack[0].state.current ).toContain({ 'x.a': 2 })

            expect( stack[1].action.type ).toBe( '@@lazyUpdate' )
            expect( stack[1].state.outdated ).toEqual({ 'B': false, 'x.a': false })
            expect( stack[1].state.current ).toEqual({ 'B': 12, 'x.a': 2 })

            expect( stack[2].action.type ).toBe( 'aaa' )
            expect( stack[2].state.outdated ).toEqual({ 'B': true, 'x.a': false })
            expect( stack[2].state.current ).toContain({ 'x.a': 3 })

        })
    })

    describe('getFragments', function(){

        it('sould expose the method "_getFragments"', function(){

            const store = create({})

            expect( store._getFragments ).toExist()
        })

        it('sould return the list of fragment', function(){

            const A = () => 0

            const B = () => 0
            B.dependencies = [ A ]

            const store = create({ u: { A, B } })

            store._getFragments()
                .forEach( f =>
                    expect( f )
                        .toContainKeys([ 'index', 'name', 'stateless', 'cold', 'dependencies' ])
                )

            expect( store._getFragments().find( x => x.name == 'u.A' ).dependencies )
                .toEqual([ ])

            expect( store._getFragments().find( x => x.name == 'u.B' ).dependencies )
                .toEqual([ 'u.A' ])
        })
    })

    xdescribe('injectState', function(){

        it('sould expose the method "_injectState"', function(){

            const store = create({})

            expect( store._injectState ).toExist()
        })
    })
})
