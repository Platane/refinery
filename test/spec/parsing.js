import expect           from 'expect'
import createReducer    from '../../src'
import {createStore}    from 'redux'

describe('parsing', () => {

    describe('naming', () => {
        it('should parse tree and name state', () => {
            const A = () => 1
            const B = () => 2
            const C = () => 3

            const { initState } = createReducer({ A, u:{ v: { B,C } } })

            expect( initState )
                .toContainKeys([
                    'A',
                    'u.v.B',
                    'u.v.C',
                ])
        })
    })

    describe('dependencies declaration', () => {

        describe('with reference', () => {

            it('should based the init value on dependencies', () => {

                const A = {
                    reduce      : () => 1,
                }
                const B = {
                    reduce      : a => a+1,
                    dependencies: [ A ],
                }


                const { reduce, initState } = createReducer({ A, B })
                const store = createStore( reduce, initState )

                expect( store.getState() )
                    .toContain({
                        'A'     : 1,
                        'B'     : 2,
                    })

            })
        })

        describe('with name', () => {

            it('should based the init value on dependencies', () => {

                const A = {
                    reduce      : () => 1,
                }
                const B = {
                    reduce      : a => a+1,
                    dependencies: [ 'A' ],
                }

                const { reduce, initState } = createReducer({ A, B })
                const store = createStore( reduce, initState )

                expect( store.getState() )
                    .toContain({
                        'A'     : 1,
                        'B'     : 2,
                    })

            })
        })

    })

    describe('source declaration', () => {

        it('should call update with the action as first parameter', () => {

            const A = {
                reduce      : action => action && action.value,
                source      : true,
            }

            const { reduce, initState } = createReducer({ A })
            const store = createStore( reduce, initState )

            expect( initState )
                .toContain({
                    'A'     : null,
                })

            store.dispatch({ type:'@@', value: 3 })

        })
    })

    describe('stateless declaration', () => {

        it('should call update without the previous state', () => {

            const A = () => 1
            const B = () => 1


            const C = {
                reduce      : (...args) => {
                    expect( args.length ).toBe( 2 )
                    return 2
                },
                stateless   : true,
                dependencies: [A,B],
            }

            const { reduce, initState } = createReducer({ A, B, C })
            createStore( reduce, initState )

        })
    })

})
