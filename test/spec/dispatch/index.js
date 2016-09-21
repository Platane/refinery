import expect           from 'expect'
import { create }       from '../../../src'

describe('dispatch', function(){

    it('should change value after a dispatch', function(){

        const B = ( action ) => action.payload.value
        B.initValue = 0
        B.actions = ['incr']

        const A = ( b ) => b+1
        A.dependencies = [ B ]

        const U = ( a,b ) => [a,b]
        U.dependencies = [ A, B ]

        const store = create({ A, B, U })

        expect( store.getValue( A ) ).toBe( 1 )
        expect( store.getValue( B ) ).toBe( 0 )
        expect( store.getValue( U ) ).toEqual( [1,0] )

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( store.getValue( A ) ).toBe( 4 )
        expect( store.getValue( B ) ).toBe( 3 )
        expect( store.getValue( U ) ).toEqual( [4,3] )
    })
})
