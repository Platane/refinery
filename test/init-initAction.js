import expect           from 'expect'
import {create}         from '../src'


describe('init value', () => {

    it('init action ( if no default value )', () =>{

        let called = false
        const A = ( action, previousValue ) =>
            called = 6

        A.actions = [ 'z' ]

        const x = create( {A} )

        expect( x.getValue( A ) ).toBe( 6 )
        expect( called ).toBe( 6 )
    })
})
