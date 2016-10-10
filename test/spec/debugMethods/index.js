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
    })

    xdescribe('injectState', function(){

        it('sould expose the method "_injectState"', function(){

            const store = create({})

            expect( store._injectState ).toExist()
        })
    })
})
