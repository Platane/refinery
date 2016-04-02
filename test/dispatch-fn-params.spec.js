import expect           from 'expect'
import {create}         from '../src'


describe('dispatch', () => {

    describe('function params', () => {

        it('one frag one action', () =>{

            const A = ( action, previousValue ) => {
                expect( action ).toEqual( {type:'z'} )
                expect( previousValue ).toEqual( null )
            }
            A.actions = [ {type:'z'} ]

            const x = create( {A} )

            x.dispatch({type:'z'})
        })

        it('two dependants frags', () =>{

            const A = ( action, previousState ) => {
                expect( action ).toEqual( {type:'z'} )
                expect( previousState ).toEqual( null )
                return 'y'
            }
            A.actions = [ {type:'z'} ]

            const B = ( valueA, previousValue, previousValueA ) => {
                expect( valueA ).toEqual( 'y' )
                expect( previousValue ).toEqual( null )
                expect( previousValueA ).toEqual( null )
            }

            const x = create( {A,B} )

            x.dispatch({type:'z'})
        })

    })
})
