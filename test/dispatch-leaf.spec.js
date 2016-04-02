import expect           from 'expect'
import {create}         from '../src'


describe('leaf', () => {

    describe('register', () => {

        it('one frag with one leaf registred', () =>{

            let called = false

            const A = ( action, previousValue ) =>
                45

            A.actions = [ 'z' ]

            const x = create( {A} )
            const fn = valueA => {
                expect( valueA ).toBe( 45 )
                called = true
            }

            x.register( A, fn )

            x.dispatch({type:'z'})

            expect( called ).toExist()
        })
    })

    describe('unregister', () => {

        it('one frag with one leaf un-registred', () =>{

            let called = false

            const A = ( action, previousValue ) =>
                45

            A.actions = [ 'z' ]

            const x = create( {A} )
            const fn = valueA => {
                expect( valueA ).toBe( 45 )
                called = true
            }

            x.register( A, fn )
            x.unregister( fn )


            x.dispatch({type:'z'})

            expect( !called ).toExist()
        })
    })
})
