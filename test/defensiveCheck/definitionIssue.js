import expect           from 'expect'
import {create}         from '../../src'

describe('definition issues', () => {

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
            A.dependencies = [ null ]

            let err

            try{
                create( {A} )
            }catch( e ){ err = e }

            expect( warned ).toExist()
            expect( err ).toBe( 'unexpected fragment definition' )

        })
    })

    describe('undefined definition', () => {
        it( 'should throw error and display warning', () => {

            let err

            try{
                create( {a:null} )
            }catch( e ){ err = e }

            expect( warned ).toExist()
            expect( err ).toBe( 'unexpected fragment definition' )
        })
    })

})
