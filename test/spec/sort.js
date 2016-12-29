import expect           from 'expect'
import createReducer    from '../../src'
import {createStore}    from 'redux'

describe('sort', () => {

    it('should update derivation in correct order', () => {

        const list = []
        const spy = ( label, fn ) =>
            ( ...args ) => {
                list.push( label )
                return fn( ...args )
            }


        const A = spy( 'A',
            ( action, a ) => {
                switch( action.type ){
                    case 'blue'     : return 4
                    case 'yellow'   : return 8
                    default         : return a || 0
                }
            }
        )
        A.source = true

        const B = spy( 'B', a => a )
        B.dependencies = [ A ]

        const C = spy( 'C', b => b )
        C.dependencies = [ B ]


        const D = spy( 'D', ( action, c ) => c )
        D.source = true
        D.dependencies = [ C ]

        const E = spy( 'E', ( b, d, a ) => b+d+a )
        E.dependencies = [ B, D, A ]




        const { reduce, initState } = createReducer({ D, C, E, A, B })
        const store = createStore( reduce, initState )

        list.length = 0

        store.dispatch({ type:'yellow'})

        expect( list )
            .toEqual([ 'A', 'B', 'C', 'D', 'E' ])

    })

})
