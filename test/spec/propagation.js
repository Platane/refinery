import expect           from 'expect'
import createReducer    from '../../src'
import {createStore}    from 'redux'

describe('propagation', () => {

    it('should propage update to derivation, and derivation only', () => {

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

        const B = spy( 'B', a => a+'b' )
        B.dependencies = [ 'A' ]

        const C = spy( 'C', (b,d) => b+'-'+d )
        C.dependencies = [ 'B', 'D' ]

        const D = spy( 'D', (a,b,w) => a+'d'+w )
        D.dependencies = [ 'A', 'B', 'W' ]

        const W = ( action, w ) => {
            switch( action.type ){
                case 'purple' : return 4
                default       : return w || 2
            }
        }
        W.source = true

        const { reduce, initState } = createReducer({ A, D, C, W, B })
        const store = createStore( reduce, initState )

        expect( store.getState() )
            .toContain({
                'A'     : 0,
                'W'     : 2,
                'B'     : '0b',
                'D'     : '0d2',
                'C'     : '0b-0d2',
            })


        list.length=0
        store.dispatch({ type:'yellow'})

        expect( store.getState() )
            .toContain({
                'A'     : 8,
                'W'     : 2,
                'B'     : '8b',
                'D'     : '8d2',
                'C'     : '8b-8d2',
            })

        expect( list ).toEqual([ 'A', 'B', 'D', 'C' ])




        list.length=0
        store.dispatch({ type:'purple'})

        expect( store.getState() )
            .toContain({
                'A'     : 8,
                'W'     : 4,
                'B'     : '8b',
                'D'     : '8d4',
                'C'     : '8b-8d4',
            })

        expect( list ).toEqual([ 'A', 'D', 'C' ])

    })

})
