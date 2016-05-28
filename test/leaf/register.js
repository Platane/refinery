import expect           from 'expect'
import {create}         from '../../src'


describe('register callback to a fragment change', () => {

    it('should be called when fragment changes', () =>{

        const A = action => action.type

        A.allAction = true

        const x = create( {A} )

        x.dispatch({type:'a'})

        let called = false
        const fn = valueA =>
            called = valueA


        x.register( A, fn )
        x.dispatch({type:'b'})


        expect( called ).toExist( 'b' )
    })

    it('should not be called when fragment does not changes', () =>{

        const A = action => action.type

        A.allAction = true

        const x = create( {A} )

        x.dispatch({type:'a'})

        let called = false
        const fn = valueA =>
            called = valueA


        x.register( A, fn )
        x.dispatch({type:'a'})


        expect( called ).toBe( false )
    })

})
