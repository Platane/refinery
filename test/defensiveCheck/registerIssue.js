import expect           from 'expect'
import {create}         from '../../src'

describe('register issues', () => {

    let warned = null
    let consoleWarn = null

    beforeEach( () => {

        warned = null

        consoleWarn = console.warn
        console.warn = ( ...args ) =>
            warned = args
    })

    afterEach( () => {
        console.warn = consoleWarn
    })

    describe('undefined dependency', () => {
        it( 'should throw error and display warning', () => {
            const A = () => 0
            const {register} = create( {A} )

            let err

            try{
                register( null, () => 0 )
            }catch( e ){ err = e }

            expect( warned ).toExist()
            expect( err ).toBe( 'trying to register change to undefined fragment' )

        })
    })

})
