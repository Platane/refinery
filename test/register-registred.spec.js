import expect           from 'expect'
import {create}         from '../src'


describe('register', () => {

    describe('have fragment registred', () => {

        it('one frag', () =>{

            const A = () => null

            const x = create( A )

            expect( x.fragments().length ).toBe( 1 )
            expect( x.fragments()[0].fn ).toBe( A )
            expect( x.fragments()[0].path.join('.') ).toBe( '' )
        })

        it('one frag nested', () =>{

            const A = () => null

            const x = create( {A} )

            expect( x.fragments().length ).toBe( 1 )
            expect( x.fragments()[0].fn ).toBe( A )
            expect( x.fragments()[0].path.join('.') ).toBe( 'A' )
        })

        it('two frags nested', () =>{

            const A = () => null
            const B = () => null

            const x = create( {A,B} )

            expect( x.fragments().length ).toBe( 2 )
            expect( x.fragments().some( x => x.fn == A ) ).toBe( true )
            expect( x.fragments().some( x => x.fn == B ) ).toBe( true )
        })

        it('complex nesting', () =>{

            const A = () => null
            const B = () => null

            const x = create( {A,U:{B}} )

            expect( x.fragments().length ).toBe( 2 )
            expect( x.fragments().some( x => x.fn == A && x.path.join('.') == 'A' ) ).toBe( true )
            expect( x.fragments().some( x => x.fn == B && x.path.join('.') == 'U.B' ) ).toBe( true )
        })

        it('hidden frag ( not in the fragment declaration, but listed as dependency )', () =>{

            const A = () => null
            const B = () => null

            A.dependencies = [ B ]

            const x = create( {A} )

            expect( x.fragments().length ).toBe( 2 )
            expect( x.fragments().some( x => x.fn == B ) ).toBe( true )
        })
    })
})
