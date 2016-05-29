import expect           from 'expect'
import {create}         from '../../src'



describe('arguments', () => {

    it('action triggered', () =>{

        let check = false

        const A = ( action, previousValue ) => {

            if ( check ) {

                expect( action.type ).toBe( 'y' )
                expect( previousValue ).toBe( 'z' )
            }

            return action.type
        }
        A.allActions = true

        const x = create( {A} )

        x.dispatch({type:'z'})

        check = true

        x.dispatch({type:'y'})
    })

    it('dependency trigerred', () =>{

        const A = action =>
            action.type

        A.allActions = true

        let check = false

        const B = ( valueA, previousValue, previousValueA ) => {

            if ( check ) {

                expect( valueA ).toBe( 'y' )
                expect( previousValue ).toBe( 'z0' )
                expect( previousValueA ).toBe( 'z' )
            }

            return valueA+'0'
        }
        B.dependencies = [ A ]

        const x = create( {A,B} )

        x.dispatch({type:'z'})

        check = true

        x.dispatch({type:'y'})
    })

    it('fragment as projector dependency trigerred', () =>{

        const A = action =>
            action.type

        A.allActions = true

        let check = false

        const B = ( valueA, previousValue, previousValueA ) => {

            if ( check ) {

                expect( valueA ).toBe( 'y' )
                expect( previousValue ).toBe( undefined )
                expect( previousValueA ).toBe( undefined )
            }

            return valueA+'0'
        }
        B.dependencies = [ A ]
        B.projector = true

        const x = create( {A,B} )

        x.dispatch({type:'z'})

        check = true

        x.dispatch({type:'y'})
    })

})
