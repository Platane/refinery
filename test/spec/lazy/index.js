import expect           from 'expect'
import { create }       from '../../../src'

describe('lazy evaluation', function(){

    beforeEach(function(){

        //        A
        //        |
        //        B
        //      /   \
        //    C       D

        this.calls          = []

        this.A              = ( action ) =>  {this.calls.push('A'); return action.payload.value }
        this.A.initValue    = 0
        this.A.actions      = ['incr']

        this.B              = a => {this.calls.push('B'); return a+1}
        this.B.dependencies = [ this.A ]
        this.B.stateless    = true

        this.C              = b => {this.calls.push('C'); return b+0.5}
        this.C.dependencies = [ this.B ]
        this.C.stateless    = true

        this.D              = b => {this.calls.push('D'); return b+0.3}
        this.D.dependencies = [ this.B ]
        this.D.stateless    = true

    })

    it('should not update a cold fragment', function(){

        const {A,B,C,D} = this

        const store = create({ A,B,C,D })
        this.calls.length = 0


        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( this.calls ).toEqual([ 'A' ])
    })

    it('should update a cold fragment on getValue', function(){

        const {A,B,C,D} = this

        const store = create({ A,B,C,D })
        this.calls.length = 0


        store.dispatch({ type:'incr', payload:{ value: 3 } })

        store.getValue( C )

        expect( this.calls ).toEqual([ 'A', 'B', 'C'  ])
    })

    it('a fragment should not be cold as soon as it is listened', function(){

        const {A,B,C,D} = this

        const store = create({ A,B,C,D })
        this.calls.length = 0


        store.register( D, () => 0 )

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( this.calls ).toEqual([ 'A', 'B', 'D'  ])
    })

    it('a fragment should not be cold again if it is no longuer listened', function(){

        const {A,B,C,D} = this

        const store = create({ A,B,C,D })
        this.calls.length = 0


        const handler = () => 0
        store.register( D, handler )
        store.unregister( handler )

        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( this.calls ).toEqual([ 'A'  ])
    })

    it('a fragment can not be cold if it is the dependency of a stateful fragment', function(){

        const {A,B,C,D} = this

        D.stateless = false

        const store = create({ A,B,C,D })
        this.calls.length = 0

        
        store.dispatch({ type:'incr', payload:{ value: 3 } })

        expect( this.calls ).toEqual([ 'A', 'B', 'D' ])
    })



})
