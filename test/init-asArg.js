import expect           from 'expect'
import {create}         from '../src'


describe('init value ( with init state passed as arg )', () => {

    it('init fragment', () =>{

        let called = false
        const A = ( action, previousValue ) =>
            called = 6

        A.actions = [ 'z' ]

        const x = create( {A}, {A:10} )

        expect( x.getValue( A ) ).toBe( 10 )
        expect( called ).toBe( false )
    })

    it('init nested fragment', () =>{

        let called = false
        const A = ( action, previousValue ) =>
            called = 6

        A.actions = [ 'z' ]

        const x = create( {Z:{A}}, {Z:{A:10}} )

        expect( x.getValue( A ) ).toBe( 10 )
        expect( called ).toBe( false )
    })
})
