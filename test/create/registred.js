import expect           from 'expect'
import {create}         from '../../src'


describe('listed after register', () => {

    it('one frag', () =>{

        const A = () => null

        const x = create( A )

        expect( x.list().length ).toBe( 1 )
        expect( x.list()[0].fn ).toBe( A )
        expect( x.list()[0].id ).toBe( '' )
    })

    it('one frag nested', () =>{

        const A = () => null

        const x = create( {A} )

        expect( x.list().length ).toBe( 1 )
        expect( x.list()[0].fn ).toBe( A )
        expect( x.list()[0].id ).toBe( 'A' )
    })

    it('two frags nested', () =>{

        const A = () => null
        const B = () => null

        const x = create( {A,B} )

        expect( x.list().length ).toBe( 2 )
        expect( x.list().some( x => x.fn == A ) ).toBe( true )
        expect( x.list().some( x => x.fn == B ) ).toBe( true )
    })

    it('complex nesting', () =>{

        const A = () => null
        const B = () => null

        const x = create( {A,U:{B}} )

        expect( x.list().length ).toBe( 2 )
        expect( x.list().some( x => x.fn == A && x.id == 'A' ) ).toBe( true )
        expect( x.list().some( x => x.fn == B && x.id == 'U.B' ) ).toBe( true )
    })

    it('hidden frag ( not in the fragment declaration, but listed as dependency )', () =>{

        const A = () => null
        const B = () => null

        A.dependencies = [ B ]

        const x = create( {A} )

        expect( x.list().length ).toBe( 2 )
        expect( x.list().some( x => x.fn == B ) ).toBe( true )
    })
})
