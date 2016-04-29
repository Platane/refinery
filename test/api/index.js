import expect           from 'expect'
import * as exposure    from '../../src'


describe('API', () => {

    it('main methods', () =>{

        expect( exposure.create ).toExist()

    })

    it('graph methods', () =>{

        const x =exposure.create({})

        expect( x.dispatch ).toExist()
        expect( x.register ).toExist()
        expect( x.unregister ).toExist()

        expect( x.list ).toExist()
        expect( x.getValue ).toExist()
    })

})
