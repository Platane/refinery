import expect           from 'expect'
import {create}         from '../src'


describe('leaf', () => {

    describe('params', () => {

        it('one frag with one leaf registred', () =>{

            const A = ( action, previousValue ) =>
                45

            A.actions = [ 'z' ]

            const x = create( {A} )
            const fn = valueA =>
                expect( valueA ).toBe( 45 )


            x.register( A, fn )

            x.dispatch({type:'z'})
        })
    })

    describe('register', () => {

        it('one frag with one leaf registred', () =>{

            let called = false

            const A = ( action, previousValue ) =>
                45

            A.actions = [ 'z' ]

            const x = create( {A} )
            const fn = valueA =>
                called = true


            x.register( A, fn )

            x.dispatch({type:'z'})

            expect( called ).toExist()
        })

        it('one frag with one leaf registred, fragment does not change', () =>{

            let called = false

            const A = ( action, previousValue ) =>
                previousValue

            A.actions = [ 'z' ]

            const x = create( {A} )
            const fn = valueA =>
                called = true

            x.register( A, fn )

            x.dispatch({type:'z'})

            expect( !called ).toExist()
        })
    })

    describe('unregister', () => {

        it('one frag with one leaf un-registred', () =>{

            let called = false

            const A = ( action, previousValue ) =>
                45

            A.actions = [ 'z' ]

            const x = create( {A} )
            const fn = valueA =>
                called = true

            x.register( A, fn )
            x.unregister( fn )


            x.dispatch({type:'z'})

            expect( !called ).toExist()
        })
    })
})
