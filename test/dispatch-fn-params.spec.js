import expect           from 'expect'
import {create}         from '../src'


describe('dispatch', () => {

    describe('function params', () => {

        it('action triggered', () =>{

            const A = ( action, previousValue, getValue, getPreviousValue ) => {
                expect( action ).toEqual( {type:'z'} )
                expect( previousValue ).toEqual( 34 )
                expect( typeof getValue ).toEqual( 'function' )
                expect( typeof getPreviousValue ).toEqual( 'function' )
                expect( getPreviousValue( A ) ).toEqual( 34 )
                expect( getValue( A ) ).toEqual( 34 )
            }
            A.actions = [ 'z' ]
            A.defaultValue = 34

            const x = create( {A} )

            x.dispatch({type:'z'})
        })

        it('dependency trigerred', () =>{

            const A = ( action, previousState ) =>
                'y'

            A.actions = [ 'z' ]
            A.defaultValue = 'u'

            const B = ( valueA, previousValue, getValue, getPreviousValue ) => {
                expect( valueA ).toEqual( 'y' )
                expect( previousValue ).toEqual( 'k' )
                expect( getValue( A ) ).toBe( 'y' )
                expect( getPreviousValue( A ) ).toBe( 'u' )
            }
            B.defaultValue = 'k'
            B.dependencies = [ A ]

            const x = create( {A,B} )

            x.dispatch({type:'z'})
        })

    })
})
