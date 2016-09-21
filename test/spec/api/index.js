import expect           from 'expect'
import * as exposure    from '../../../src'


describe('API', function(){

    it('sould expose main "create" methods', function(){

        expect( exposure.create ).toExist()

    })

    it('created object should expose dispatch / register / unregister / getValue', function(){

        const x = exposure.create({})

        expect( x.dispatch ).toExist()
        expect( x.register ).toExist()
        expect( x.unregister ).toExist()

        expect( x.getValue ).toExist()
    })

})
