import expect           from 'expect'
import {create}         from '../src'


describe('init value', () => {

    it('init action ( if no default value )', () =>{

        let called = false
        const A = ( action, previousValue ) =>
            called = 6

        A.actions = [ 'z' ]

        const x = create( {A}, {A:10} )

        expect( x.getValue( A ) ).toBe( 10 )
        expect( called ).toBe( false )
    })
})
