import expect           from 'expect'
import createReducer    from '../../src'
import {createStore}    from 'redux'

describe('propagation', () => {

    it('should propage update to derivation, and derivation only', () => {

        let updated = []
        const A = {
            reduce      : ( action, a ) => {
                switch( action.type ){
                    case 'blue'     : return 4
                    case 'yellow'   : return 8
                    default         : return a || 0
                }
            },
            source       : true,
        }
        const B = {
            reduce      : a => {
                updated.push('B')
                return a+'b'
            },
            dependencies: [ 'A' ],
        }
        const C = {
            reduce      : (b,d) => {
                updated.push('C')
                return b+'-'+d
            },
            dependencies: [ 'B', 'D' ],
        }
        const D = {
            reduce      : (a,b,w) => {
                updated.push('D')
                return a+'d'+w
            },
            dependencies: [ 'A', 'B', 'W' ],
        }

        const W = {
            reduce      : ( action, w ) => {
                switch( action.type ){
                    case 'purple' : return 4
                    default       : return w || 0
                }
            },
            source       : true,
        }

        const { reduce, initState } = createReducer({ A, W, B, C, D })
        const store = createStore( reduce, initState )

        expect( store.getState() )
            .toContain({
                'A'     : 0,
                'W'     : 0,
                'B'     : '0b',
                'D'     : '0d0',
                'C'     : '0b-0d0',
            })



        updated.length=0
        store.dispatch({ type:'yellow'})

        expect( store.getState() )
            .toContain({
                'A'     : 8,
                'W'     : 0,
                'B'     : '8b',
                'D'     : '8d0',
                'C'     : '8b-8d0',
            })

        expect( updated ).toEqual([ 'B', 'D', 'C' ])




        updated.length=0
        store.dispatch({ type:'purple'})

        expect( store.getState() )
            .toContain({
                'A'     : 8,
                'W'     : 4,
                'B'     : '8b',
                'D'     : '8d4',
                'C'     : '8b-8d4',
            })

        expect( updated ).toEqual([ 'D', 'C' ])

    })

})
