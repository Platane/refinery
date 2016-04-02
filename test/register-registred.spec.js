import expect           from 'expect'
import {create}         from '../src'


describe('register', () => {

    describe('have fragment registred', () => {

        it('one frag', () =>{

            const A = () => null

            const x = create( A )

            expect( x.fragments.size ).toBe( 1 )
            expect( x.fragments.has( A ) ).toBe( true )
            expect( A.path.join('.') ).toBe( '' )
        })

        it('one frag nested', () =>{

            const A = () => null

            const x = create( {A} )

            expect( x.fragments.size ).toBe( 1 )
            expect( x.fragments.has( A ) ).toBe( true )
            expect( A.path.join('.') ).toBe( 'A' )
        })

        it('two frags nested', () =>{

            const A = () => null
            const B = () => null

            const x = create( {A,B} )

            expect( x.fragments.size ).toBe( 2 )
            expect( x.fragments.has( A ) ).toBe( true )
            expect( x.fragments.has( B ) ).toBe( true )
            expect( A.path.join('.') ).toBe( 'A' )
            expect( B.path.join('.') ).toBe( 'B' )
        })

        it('complex nesting', () =>{

            const A = () => null
            const B = () => null

            const x = create( {A,U:{B}} )

            expect( x.fragments.size ).toBe( 2 )
            expect( x.fragments.has( A ) ).toBe( true )
            expect( x.fragments.has( B ) ).toBe( true )
            expect( A.path.join('.') ).toBe( 'A' )
            expect( B.path.join('.') ).toBe( 'U.B' )
        })
    })

})
