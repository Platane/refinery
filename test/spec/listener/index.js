import expect           from 'expect'
import { create }       from '../../../src'

describe('listener', function(){

    it('should notify once after a change in dependecies', function(){

        const B = ( action ) => action.payload.value
        B.initValue = 0
        B.actions = ['incr']

        const A = ( b ) => b+1
        A.dependencies = [ B ]


        const store = create({ A, B })

        const stack = []
        store.register( A, B, ( ...args ) => stack.push( args ) )

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( stack.length ).toBe( 1 )
        expect( stack[0] ).toEqual( [4,3] )
    })

    it('should not notify after a unregister', function(){

        const B = ( action ) => action.payload.value
        B.initValue = 0
        B.actions = ['incr']

        const A = ( b ) => b+1
        A.dependencies = [ B ]


        const store = create({ A, B })

        const stack = []
        const handler = ( ...args ) => stack.push( args )
        store.register( A, B, handler )

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        store.unregister( handler )

        store.dispatch({ type:'incr', payload:{ value: 5 } })
        store.dispatch({ type:'incr', payload:{ value: 6 } })

        expect( stack.length ).toBe( 1 )
    })
})
