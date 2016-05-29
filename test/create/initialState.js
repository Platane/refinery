import expect           from 'expect'
import {create}         from '../../src'

describe('pass initial state as argument', () => {

    it('state should be set, and function should not be called as init', () =>{

        let called = false
        const A = () => called = 6

        A.allAction = true

        const x = create( {Z:{A}}, {Z:{A:10}} )

        expect( x.getValue( A ) ).toBe( 10 )
        expect( called ).toBe( false )
    })
})

describe('have initValue set', () => {
    it('should set value from initValue, function should not be called at init', () =>{

        let called = false
        const A = () => called = true

        A.allAction = true
        A.initValue = 4

        const x = create( {A} )

        expect( x.getValue( A ) ).toBe( 4 )
        expect( called ).toBe( false )
    })
})
