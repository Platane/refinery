import expect       from 'expect'
import {_test}      from '../src'
const {extractFrags} = _test

describe('extractFrags', () => {

    describe('structural check', () => {

        it('unique frag', () =>{

            const A = () => 'A'

            const register = r => ({
                'A': r( A )
            })

            const frags = extractFrags( register )

            expect( frags.length ).toBe( 1 )
            expect( frags[0].fn ).toBe( A )
            expect( frags[0].path ).toEqual( ['A'] )
        })

        it('nested frag', () =>{

            const A = () => 'A'

            const register = r => ({
                'X': {
                    'A' : r( A ),
                }
            })

            const frags = extractFrags( register )

            expect( frags.length ).toBe( 1 )
            expect( frags[0].fn ).toBe( A )
            expect( frags[0].path ).toEqual( ['X','A'] )
        })

        it('complex nested frag', () =>{

            const A = () => 'A'
            const B = () => 'B'
            const C = () => 'C'

            const register = r => ({
                'X': {
                    'A' : r( A ),
                    'Y' : (( r ) => ({
                        'B' : r( B ),
                        'Z' : {
                            'C': r( C )
                        }
                    }) )( r ),
                }
            })

            const frags = extractFrags( register )

            expect( frags.length ).toBe( 3 )
            expect( frags.some( x => x.fn==A && x.path.join('') == 'XA' ) ).toExist( )
            expect( frags.some( x => x.fn==B && x.path.join('') == 'XYB' ) ).toExist( )
            expect( frags.some( x => x.fn==C && x.path.join('') == 'XYZC' ) ).toExist( )
        })
    })


    describe('function params check', () => {

        it(' with ( fn, actions )', () =>{

            const A = () => 'A'

            const register = r => ({
                'A': r( A, ['1','2'] )
            })

            const frags = extractFrags( register )

            expect( frags.length ).toBe( 1 )
            expect( frags[0].fn ).toBe( A )
            expect( frags[0].actions ).toEqual( ['1', '2'] )
            expect( frags[0].dependencies ).toEqual( [] )
        })
        it(' with ( fn, dependencies )', () =>{

            const A = () => 'A'
            const B = () => 'B'
            const C = () => 'C'

            const register = r => ({
                'A': r( A, [B,C] )
            })

            const frags = extractFrags( register )

            expect( frags.length ).toBe( 1 )
            expect( frags[0].fn ).toBe( A )
            expect( frags[0].actions ).toEqual( [] )
            expect( frags[0].dependencies ).toEqual( [B,C] )
        })
        it(' with ( fn, actions, dependencies )', () =>{

            const A = () => 'A'
            const B = () => 'B'
            const C = () => 'C'

            const register = r => ({
                'A': r( A, ['1', '2'], [B,C] )
            })

            const frags = extractFrags( register )

            expect( frags.length ).toBe( 1 )
            expect( frags[0].fn ).toBe( A )
            expect( frags[0].actions ).toEqual( ['1', '2'] )
            expect( frags[0].dependencies ).toEqual( [B,C] )
        })
    })

})
