import expect           from 'expect'
import {create}         from '../src'


describe('get value', () => {

    it('return the current value', () =>{

        const A = () => 3
        const x = create( {A} )

        expect( x.getValue( A ) ).toBe( 3 )
    })

    it('return the current value ( after dispatching )', () =>{

        let i = 3
        const A = () => i++
        A.actions = ['z']

        const x = create( {A} )

        x.dispatch({type:'z'})

        expect( x.getValue( A ) ).toBe( 4 )
    })
})
