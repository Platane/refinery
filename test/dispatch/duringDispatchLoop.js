import expect           from 'expect'
import {create}         from '../../src'


it('should wait for the first dispatch loop to finish before starting another one', () =>{

    const preValue = []
    const postValue = []

    const A = action => action.type

    A.source = true

    const x = create( {A} )
    x.dispatch({type:'a'})

    const fn = valueA => {
        preValue.push( valueA )
        x.dispatch({type:'c'})
        postValue.push( valueA )
    }

    x.register( A, fn )

    x.dispatch({type:'b'})

    expect( preValue ).toEqual([ 'b', 'c' ])
    expect( postValue ).toEqual([ 'b', 'c' ])
})
