import expect           from 'expect'
import { create }       from '../../../src'

describe('warning', function(){

    beforeEach(function(){
        this._original_console_error = console.error
        this._original_console_warn  = console.warn
        this.errorStack = []
        this.warnStack  = []
        console.error = err => this.errorStack.push( err )
        console.warn  = err => this.warnStack.push( err )
    })
    afterEach(function(){
        console.error = this._original_console_error
        console.warn  = this._original_console_warn
    })

    describe('dispatch infinite loop',function(){
        it('should throw error and console.error', function(){

            const A = ( action, value ) => value+1
            A.actions = ['incr']
            A.initValue = 0

            const store = create({ A })

            store.register( A, value => {
                store.dispatch({ type: 'incr'})
                store.dispatch({ type: 'incr'})
            })

            let error
            try{
                store.dispatch({ type: 'incr'})
            }catch( err ){
                error = err
            }

            expect( error ).toExist( )
            expect( this.errorStack.length ).toBe( 1 )
        })
    })

    describe('error in fragment update function',function(){
        it('should throw error and console.error', function(){

            const A = ( action, value ) => {
                const u = void 0
                u.x = 0
            }
            A.actions = ['incr']
            A.initValue = 0

            const store = create({ A })

            let error
            try{
                store.dispatch({ type: 'incr'})
            }catch( err ){
                error = err
            }

            expect( error ).toExist( )
            expect( this.errorStack.length ).toBe( 1 )
        })
    })

    describe('error in listener callback function',function(){
        it('should throw error and console.error', function(){

            const A = ( action, value ) => value+1
            A.actions = ['incr']
            A.initValue = 0

            const store = create({ A })

            store.register( A, value => {
                const u = void 0
                u.x = 0
            })

            let error
            try{
                store.dispatch({ type: 'incr'})
            }catch( err ){
                error = err
            }

            expect( error ).toExist( )
            expect( this.errorStack.length ).toBe( 1 )
        })
    })

    describe('in fragment definition',function(){

        describe('stateless flag with action',function(){
            it('should throw error and console.warn', function(){

                const A = ( action, value ) => value+1
                A.actions = ['incr']
                A.initValue = 0
                A.stateless = true


                let error
                try{
                    create({ A })
                }catch( err ){
                    error = err
                }

                expect( error ).toExist( )
                expect( this.warnStack.length ).toBe( 1 )
            })
        })

        describe('unexpected action',function(){
            it('should throw error and console.warn', function(){

                const A = ( action, value ) => value+1
                A.actions = [ 1 ]
                A.initValue = 0


                let error
                try{
                    create({ A })
                }catch( err ){
                    error = err
                }

                expect( error ).toExist( )
                expect( this.warnStack.length ).toBe( 1 )
            })
        })

        describe('unexpected dependency',function(){
            it('should throw error and console.warn', function(){

                const A = ( action, value ) => value+1
                A.dependencies = [ 1 ]


                let error
                try{
                    create({ A })
                }catch( err ){
                    error = err
                }

                expect( error ).toExist( )
                expect( this.warnStack.length ).toBe( 1 )
            })
        })

        describe('cyclical dependencies',function(){
            it('should throw error and console.warn', function(){

                const A = ( action, value ) => value+1
                const B = ( action, value ) => value+1

                A.dependencies = [ B ]
                B.dependencies = [ A ]


                let error
                try{
                    create({ A, B })
                }catch( err ){
                    error = err
                }

                expect( error ).toExist( )
            })
        })
    })
})
