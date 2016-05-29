import expect           from 'expect'
import {create}         from '../../src'


describe('function call', () => {

    it('one source, should be called', () =>{

        let called = false

        const A = () =>
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


        const B = ( action ) => {
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

    it('one source with dependencies, dependency should not be called if source does not change', () =>{

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

    it('should ensure that the call order is respected', () =>{

        //   A
        //   | \
        //   B  |
        //   |  |
        //   C  |
        //   | /
        //   D
        //
        // when A change, B and D are taged as "should update"
        // B is updated, which tag C as "should update"
        //
        // D is tagged before C, but should be called after in order to preserve the dependency order

        const stack = []

        const A = () => stack.push('A')
        const B = () => stack.push('B')
        const C = () => stack.push('C')
        const D = () => stack.push('D')

        A.initValue = -1
        B.initValue = -1
        C.initValue = -1
        D.initValue = -1

        A.allAction = true

        B.dependencies = [ A ]
        D.dependencies = [ A, C ]
        C.dependencies = [ B ]

        const x = create( {A,B,C,D} )

        x.dispatch({type:'z'})

        expect( stack ).toEqual( ['A', 'B', 'C', 'D'] )
    })
})
