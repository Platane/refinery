import expect           from 'expect'
import {create}         from '../../src'


describe('action type restriction', () => {

    it('should update only if action type match', () =>{

        let A_called = false
        let B_called = false

        const A = () =>
            A_called = true
        A.actions = ['A']

        const B = () =>
            B_called = true
        B.actions = ['B']

        const x = create( {A,B} )

        // reset var because funtion may have been called for init
        A_called = false
        B_called = false

        x.dispatch({type:'A'})

        expect( A_called ).toBe( true )
        expect( B_called ).toBe( false )
    })
})
