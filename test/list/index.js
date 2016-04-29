import expect           from 'expect'
import {create}         from '../../src'


describe('get list', () => {

    it('return sorted list', () =>{

        const A = () => null
        const B = () => null

        A.dependencies = [ B ]

        const x = create( {A,B} )

        expect( x.list()[ 0 ].id ).toBe( 'B' )
        expect( x.list()[ 1 ].id ).toBe( 'A' )
    })
})
