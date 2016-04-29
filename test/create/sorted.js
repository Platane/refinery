import expect           from 'expect'
import {create}         from '../../src'



describe('sorted', () => {

    it('two frags dependant', () =>{

        const A = () => null
        const B = () => null

        B.dependencies = [ A ]

        const x = create( {A,B} )

        expect( x.list().some( x => x.fn == A && x.index == 0 ) ).toBe( true )
        expect( x.list().some( x => x.fn == B && x.index == 1 ) ).toBe( true )
    })

    it('two frags dependant ( opposite dependency )', () =>{

        const A = () => null
        const B = () => null

        A.dependencies = [ B ]

        const x = create( {A,B} )

        expect( x.list().some( x => x.fn == B && x.index == 0 ) ).toBe( true )
        expect( x.list().some( x => x.fn == A && x.index == 1 ) ).toBe( true )
    })

})
