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

    it('should change value after a dispatch, in complexe graph', function(){

        //
        //     A
        //   /   \
        //  B    |
        //  |    |
        //  C    |
        //   \  /
        //    E
        //
        // Dispatcher should be clever enought to execute C before E,
        // even if it encounters E before C

        const A = ( action ) => action.payload.value
        A.initValue = 0
        A.actions = ['incr']

        const B = ( a ) => a+1
        B.dependencies = [ A ]

        const C = ( b ) => b+9
        C.dependencies = [ B ]

        const E = ( a, c ) => a + c
        E.dependencies = [ A, C ]

        const I = a => a+5
        I.dependencies = [ A ]

        const J = a => a+1
        J.dependencies = [ A, I ]

        const W = a => a+1
        W.dependencies = [ A, I, J, E ]

        const store = create({ A, B, C, E, I, J, W })

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( store.getValue( A ) ).toBe( 3 )
        expect( store.getValue( B ) ).toBe( 4 )
        expect( store.getValue( C ) ).toBe( 13 )
        expect( store.getValue( E ) ).toBe( 16 )

    })

    it('should change value after a dispatch, in complexe graph 2', function(){

        const A = ( action ) => action.payload.value
        A.initValue = 0
        A.actions = ['incr']

        const B = ( a ) => a+'b'
        B.dependencies = [ A ]

        const C = ( b ) => b+'c'
        C.dependencies = [ B ]

        const D = ( b ) => b+'d'
        D.dependencies = [ B ]

        const E = ( b ) => b+'e'
        E.dependencies = [ B ]

        const F = ( b ) => b+'f'
        F.dependencies = [ B ]


        const X = ( a ) => a+'x'
        X.dependencies = [ A ]

        const Y = ( x ) => x+'y'
        Y.dependencies = [ X ]

        const Z = ( x ) => x+'z'
        Z.dependencies = [ X ]

        const W = ( x ) => x+'w'
        W.dependencies = [ X ]


        const I = (c,d,y) => c+d+y
        I.dependencies = [ C, D, Y ]

        const J = (c,e,f,z) => c+e+f+z
        J.dependencies = [ C, E, F, Z ]

        const K = (i,j,w) => i+j+w
        K.dependencies = [ I,J,W ]

        const store = create({ A,   B, C, D, E, F,   X, Y, Z, W, I, J, K })

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( store.getValue( I ) ).toBe( '3bc3bd3xy' )
        expect( store.getValue( J ) ).toBe( '3bc3be3bf3xz' )
        expect( store.getValue( K ) ).toBe( '3bc3bd3xy'+'3bc3be3bf3xz'+'3xw' )

    })
})
