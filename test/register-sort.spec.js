// import expect           from 'expect'
// import {create}         from '../src'
//
//
// describe('register', () => {
//
//     describe('have fragment sorted', () => {
//
//         it('two frags dependant', () =>{
//
//             const A = () => null
//             const B = () => null
//
//             B.dependencies = [ A ]
//
//             const x = create( {A,B} )
//
//             expect( A.index ).toBe( 0 )
//             expect( B.index ).toBe( 1 )
//         })
//
//         it('two frags dependant ( opposite dependency )', () =>{
//
//             const A = () => null
//             const B = () => null
//
//             A.dependencies = [ B ]
//
//             const x = create( {A,B} )
//
//             expect( A.index ).toBe( 0 )
//             expect( B.index ).toBe( 1 )
//         })
//
//     })
// })
