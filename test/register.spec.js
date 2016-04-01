import expect           from 'expect'
import {create}         from '../src'


describe('register', () => {

    it('one frag, one action', () =>{

        const A = () => null

        const x = create( A )

        expect( x.fragments.size ).toBe( 1 )
        expect( x.fragments.has( A ) ).toBe( true )
    })

})
