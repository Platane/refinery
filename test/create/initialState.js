import expect           from 'expect'
import {create}         from '../../src'

describe('pass initial state as argument', () => {

    it('state should be set, and function should not be called as init', () =>{

        let called = false
        const A = () => called = 6

        A.source = true

        const x = create( {Z:{A}}, {Z:{A:10}} )

        expect( x.getValue( A ) ).toBe( 10 )
        expect( called ).toBe( false )
    })
})
