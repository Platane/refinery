import expect           from 'expect'
import {create}         from '../src'


describe('init value', () => {

    it('defaultValue property', () =>{

        let called = false
        const A = ( action, previousValue ) =>
            called = 6

        A.actions = [ 'z' ]
        A.defaultValue = 2

        const x = create( {A} )

        expect( x.getValue( A ) ).toBe( 2 )
        expect( called ).toBe( false )
    })

    it('defaultValue property set to null', () =>{

        let called = false
        const A = ( action, previousValue ) =>
            called = 6

        A.actions = [ 'z' ]
        A.defaultValue = null

        const x = create( {A} )

        expect( x.getValue( A ) ).toBe( null )
        expect( called ).toBe( false )
    })
})
