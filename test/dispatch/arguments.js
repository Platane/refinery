import expect           from 'expect'
import {create}         from '../../src'



describe('arguments', () => {

    it('action triggered', () =>{

        let check = false

        const A = ( action, previousValue, getValue, getPreviousValue ) => {

            if ( check ) {

                expect( action.type ).toBe( 'y' )
                expect( previousValue ).toEqual( 'z' )

                expect( typeof getValue ).toEqual( 'function' )
                expect( typeof getPreviousValue ).toEqual( 'function' )
                expect( getPreviousValue( A ) ).toEqual( 'z' )
                expect( getValue( A ) ).toEqual( 'z' )
            }

            return action.type
        }
        A.source=true

        const x = create( {A} )

        x.dispatch({type:'z'})

        check = true

        x.dispatch({type:'y'})
    })

    it('dependency trigerred', () =>{

        const A = action =>
            action.type

        A.source = true

        let check = false

        const B = ( valueA, previousValue, getValue, getPreviousValue ) => {

            if ( check ) {

                expect( valueA ).toEqual( 'y' )
                expect( previousValue ).toEqual( 'z0' )
                expect( getValue( A ) ).toBe( 'y' )
                expect( getPreviousValue( A ) ).toBe( 'z' )
            }

            return valueA+'0'
        }
        B.dependencies = [ A ]

        const x = create( {A,B} )

        x.dispatch({type:'z'})

        check = true

        x.dispatch({type:'y'})
    })

})
