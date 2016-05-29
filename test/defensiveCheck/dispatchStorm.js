import expect           from 'expect'
import {create}         from '../../src'

describe('dispatch storm', () => {

    it('should throw error when too more dispatch are called inside a dispatch loop', () => {

        const A = (action, value) => value + 1
        A.actions = ['a']

        let err

        const {register, dispatch} = create( {A} )

        register( A, () => { dispatch({type:'a'}); dispatch({type:'a'}) })


        try{
            dispatch({type:'a'})
        }catch( e ){ err = e }

        expect( err ).toExist()

    })
})
