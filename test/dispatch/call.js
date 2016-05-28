import expect           from 'expect'
import {create}         from '../../src'


describe('function call', () => {

    it('one source, should be called', () =>{

        let called = false

        const A = ( action, previousValue ) =>
            called = true

        A.allAction = true

        const x = create( {A} )

        // reset var because funtion may have been called for init
        called = false

        x.dispatch({type:'z'})

        expect( called ).toExist()
    })

    it('one source with dependencies, should be called in order', () =>{

        let callStack = []


        const B = ( action, previousValue ) => {
            callStack.push( 'B' )
            return action.type
        }

        B.allAction = true


        const A = ( X ) => {
            callStack.push( 'A' )
            return X
        }

        A.dependencies=[ B ]


        const C = ( X ) => {
            callStack.push( 'C' )
            return X
        }

        C.dependencies=[ A ]


        const x = create( {A,B,C} )

        callStack.length = 0

        x.dispatch({type:'z'})

        expect( callStack ).toEqual([ 'B', 'A', 'C' ])
    })

    it('one source constant with dependencies, should be not be called', () =>{

        let called = false

        const B = () => 3
        B.allAction = true


        const A = ( X ) =>
            called = true

        A.dependencies=[ B ]


        const x = create( {A,B} )

        called = false

        x.dispatch({type:'z'})

        expect( called ).toBe( false )
    })
})
