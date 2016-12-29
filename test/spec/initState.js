import expect           from 'expect'
import createReducer    from '../../src'
import {createStore}    from 'redux'

describe('init state', () => {

    it('should init the derivations', () => {


        const A = ( action, a ) => {
            switch( action.type ){
                case 'blue'     : return 4
                default         : return a || void 0
            }
        }
        A.source = true

        const B = a => a || 0
        B.dependencies = [ A ]

        const { reduce, initState } = createReducer({ A, B })
        const store = createStore( reduce, initState )

        expect( !!store.getState()[ 'A' ] ).toBe( false )
        expect( store.getState()[ 'B' ] ).toBe( 0 )

    })

})
