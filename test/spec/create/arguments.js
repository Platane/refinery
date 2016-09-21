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
})
