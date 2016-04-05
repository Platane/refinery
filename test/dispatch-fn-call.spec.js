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

            // reset var because funtion may have been called for init
            called = false

            x.dispatch({type:'z'})

            expect( called ).toExist()
        })

        it('two frags, different actions', () =>{

            const calls = []

            const A = ( ) => {
                calls.push('A')
                return 'A'
            }
            A.actions = [ 'z' ]
            A.defaultValue = null

            const B = ( ) => {
                calls.push('B')
                return 'B'
            }
            B.actions = [ 'y' ]
            B.defaultValue = null

            const x = create( {A,B} )

            x.dispatch({type:'z'})

            expect( calls ).toEqual( ['A'] )
        })

        it('two dependant frags, first one change', () =>{

            const calls = []

            const A = ( ) => {
                calls.push('A')
                return 'A'
            }
            A.actions = [ 'z' ]
            A.defaultValue = null

            const B = ( ) => {
                calls.push('B')
                return 'B'
            }
            B.dependencies = [ A ]
            B.defaultValue = null

            const x = create( {A,B} )

            x.dispatch({type:'z'})

            expect( calls ).toEqual( ['A','B'] )
        })

        it('two dependant frags, first one does not change', () =>{

            const calls = []

            const A = ( action, previousValue ) => {
                calls.push('A')
                return previousValue
            }
            A.actions = [ 'z' ]
            A.defaultValue = null

            const B = ( ) => {
                calls.push('B')
                return 'B'
            }
            B.dependencies = [ A ]
            B.defaultValue = null

            const x = create( {A,B} )

            x.dispatch({type:'z'})

            expect( calls ).toEqual( ['A'] )
        })

        it('complex', () =>{

            const calls = []

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

            A.label = 'A'
            B.label = 'B'
            C.label = 'C'
            D.label = 'D'
            E.label = 'E'
            F.label = 'F'
            G.label = 'G'
            H.label = 'H'
            I.label = 'I'
            J.label = 'J'
            K.label = 'K'

            A.defaultValue = 'init'
            B.defaultValue = 'init'
            C.defaultValue = 'init'
            D.defaultValue = 'init'
            E.defaultValue = 'init'
            F.defaultValue = 'init'
            G.defaultValue = 'init'
            H.defaultValue = 'init'
            I.defaultValue = 'init'
            J.defaultValue = 'init'
            K.defaultValue = 'init'

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
            J.actions = [ 'z' ]
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

            // reset array because funtion may have been called for init
            calls.length=0

            x.dispatch({type:'z'})

            const valid = [ A,B,C,D,E,F,G,H,I,J,K ]
                .every( Y =>
                    ( Y.dependencies || [] ).every( X =>
                        calls.findIndex( l => l == X.label ) < calls.findIndex( l => l == Y.label )
                    )
                )

            expect( valid ).toExist()
            expect( calls.length ).toBe( 11 )
        })
    })
})
