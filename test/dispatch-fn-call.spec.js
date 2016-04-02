import expect           from 'expect'
import {create}         from '../src'


describe('dispatch', () => {

    describe('function call', () => {

        it('one frag one action', () =>{

            let called = false

            const A = ( action, previousValue ) =>
                called = true

            A.actions = [ 'z' ]

            const x = create( {A} )

            x.dispatch({type:'z'})

            expect( called ).toExist()
        })

    })
})
