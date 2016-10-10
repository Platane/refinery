import expect           from 'expect'
import { create }       from '../../../src'


describe('arguments parsing', function(){

    describe('tree parsing', function(){

        it('sould name correctly the fragments', function(){

            const A = () => 1
            const B = () => 1
            const C = () => 1
            const D = () => 1

            const tree = {
                A,
                u: {
                    v : { C, D },
                    w : { k : { B } },
                },
            }

            const store = create( tree )
            ;[
                'A',
                'u.v.C',
                'u.v.D',
                'u.w.k.B',
            ].every( name => expect( name in store.getState() ).toBeTruthy() )

        })
    })

    describe('init value', function(){

        it('should have the fragments inited, and the update not called', function(){

            let called = false

            const A = ( action ) => called = true
            A.initValue = 14

            const store = create({ A })

            expect( store.getValue( A ) ).toBe( 14 )
            expect( called ).toBe( false )
        })

    })

    describe('all actions', function(){

        it('should update to any action when register to "allActions"', function(){

            const called = []

            const A = ( action ) =>
                called.push( action.type )
            A.allActions = true


            const store = create({ A })

            store.dispatch({ type:'aaa' })
            store.dispatch({ type:'bbb' })

            expect( called )
                .toEqual([ '@@init', 'aaa', 'bbb' ])
        })
    })

    describe('equal', function(){

        it('should use the "equal" compare function to determine equality', function(){

            const called = []

            const A = ( action ) =>
                ({ key : 3 })
            A.actions = [ 'aaa' ]
            A.equal = ( a,b ) => a.key == b.key


            const store = create({ A })

            store.register( A, value => called.push( value.key ) )

            store.dispatch({ type:'aaa' })

            expect( called )
                .toEqual([ ])
        })

    })
})
