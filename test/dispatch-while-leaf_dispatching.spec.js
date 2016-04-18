import expect           from 'expect'
import {create}         from '../src'


describe('leaf dispatching', () => {

    it('should wait for the dispatch loop to finish before starting another one', () =>{

        const preValue = []
        const postValue = []

        const A = ( action, previousValue ) =>
            Math.min( previousValue +1, 3 )

        A.actions = [ 'z' ]
        A.defaultValue = 0

        const x = create( {A} )

        const fn = valueA => {
            preValue.push( valueA )
            x.dispatch({type:'z'})
            postValue.push( valueA )
        }

        x.register( A, fn )

        x.dispatch({type:'z'})

        expect( preValue ).toEqual([1,2,3])
        expect( postValue ).toEqual([1,2,3])
    })
})
