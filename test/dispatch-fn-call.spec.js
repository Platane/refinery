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

        it('complex', () =>{

            let calls = []

            const A = ( ) => calls.push('A')
            const B = ( ) => calls.push('B')
            const C = ( ) => calls.push('C')
            const D = ( ) => calls.push('D')
            const E = ( ) => calls.push('E')
            const F = ( ) => calls.push('F')
            const G = ( ) => calls.push('G')
            const H = ( ) => calls.push('H')
            const I = ( ) => calls.push('I')
            const J = ( ) => calls.push('J')
            const K = ( ) => calls.push('K')

            A.actions = [ 'z' ]
            B.actions = [ 'z' ]
            C.dependencies = [ A ]
            D.dependencies = [ B ]
            E.dependencies = [ A, B, C, D ]
            F.dependencies = [ A, C, D ]
            G.dependencies = [ E, C ]
            H.dependencies = [ G ]
            I.dependencies = [ F, E ]
            J.dependencies = [ I, A ]
            K.dependencies = [ G, E, B ]



            const x = create( {
                J,
                A,
                x:{
                    B,
                    F,
                    I,
                    u:{
                        H
                    },
                    E
                },
                C,
                u:{
                    G,
                    K,
                    D
                }
            })

            x.dispatch({type:'z'})

            const valid = [ A,B,C,D,E,F,G,H,I,J,K ]
                .every( Y =>
                    Y.dependencies.every( X =>
                        calls.findIndex( l => l == X.path[ X.path.length-1 ] ) < calls.findIndex( l => l == Y.path[ Y.path.length-1 ] )
                    )
                )

            expect( valid ).toExist()
            expect( calls.length ).toBe( 11 )
        })
    })
})
