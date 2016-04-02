import expect           from 'expect'
import {create}         from '../src'


describe('register', () => {

    describe('have fragment dependencies registred ( and next )', () => {

        it('two frags dependant', () =>{

            const A = () => null
            const B = () => null

            B.dependencies = [ A ]

            const x = create( {A,B} )

            expect( A.dependencies ).toEqual( [ ] )
            expect( B.dependencies ).toEqual( [ A ] )

            expect( A.next ).toEqual( [ B ] )
            expect( B.next ).toEqual( [  ] )
        })

        it('complex dependancies', () =>{

            const A = () => null
            const B = () => null
            const C = () => null
            const D = () => null

            B.dependencies = [ A ]
            D.dependencies = [ B, C ]

            const x = create( {A,B,C,D} )

            expect( A.dependencies ).toEqual( [ ] )
            expect( B.dependencies ).toEqual( [ A ] )
            expect( C.dependencies ).toEqual( [ ] )
            expect( D.dependencies ).toContain( B )
            expect( D.dependencies ).toContain( C )
            expect( A.next ).toEqual( [ B ] )
            expect( B.next ).toEqual( [ D ] )
            expect( C.next ).toEqual( [ D ] )
            expect( D.next ).toEqual( [ ] )
        })
    })

})
