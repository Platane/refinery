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

        it('two frags, different actions', () =>{

            let calls = []

            const A = ( ) => {
                calls.push('A')
                return 'A'
            }
            A.actions = [ 'z' ]

            const B = ( ) => {
                calls.push('B')
                return 'B'
            }
            B.actions = [ 'y' ]

            const x = create( {A,B} )

            x.dispatch({type:'z'})

            expect( calls ).toEqual( ['A'] )
        })

        it('two dependant frags, first one change', () =>{

            let calls = []

            const A = ( ) => {
                calls.push('A')
                return 'A'
            }
            A.actions = [ 'z' ]

            const B = ( ) => {
                calls.push('B')
                return 'B'
            }
            B.dependencies = [ A ]

            const x = create( {A,B} )

            x.dispatch({type:'z'})

            expect( calls ).toEqual( ['A','B'] )
        })

        it('two dependant frags, first one does not change', () =>{

            let calls = []

            const A = ( action, previousValue ) => {
                calls.push('A')
                return previousValue
            }
            A.actions = [ 'z' ]

            const B = ( ) => {
                calls.push('B')
                return 'B'
            }
            B.dependencies = [ A ]

            const x = create( {A,B} )

            x.dispatch({type:'z'})

            expect( calls ).toEqual( ['A'] )
        })
    })
})
