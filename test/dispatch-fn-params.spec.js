import expect           from 'expect'
import {create}         from '../src'


describe('dispatch', () => {

    describe('function params', () => {

        it('one frag one action', () =>{

            const A = ( action, previousValue, getValue, getPreviousValue ) => {
                expect( action ).toEqual( {type:'z'} )
                expect( previousValue ).toEqual( null )
                expect( typeof getValue ).toEqual( 'function' )
                expect( typeof getPreviousValue ).toEqual( 'function' )
            }
            A.actions = [ {type:'z'} ]
            A.defaultValue = null

            const x = create( {A} )

            x.dispatch({type:'z'})
        })

        it('two dependants frags', () =>{

            const A = ( action, previousState ) => {
                expect( action ).toEqual( {type:'z'} )
                expect( previousState ).toEqual( 'u' )
                return 'y'
            }
            A.actions = [ {type:'z'} ]
            A.defaultValue = 'u'

            const B = ( valueA, previousValue ) => {
                expect( valueA ).toEqual( 'y' )
                expect( previousValue ).toEqual( 'k' )
            }
            B.defaultValue = 'k'

            const x = create( {A,B} )

            x.dispatch({type:'z'})
        })

    })
})
