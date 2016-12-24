

const list = {
    source  : true,
    reduce  : ( action, previous ) => {
        switch( action.type ){
            case 'add' :
            {
                return [ action.payload.item, ...previous ]
            }

            default:
                return previous
        }
    },
}

const length = {
    stateless   : false,
    dependencies: [ 'list' ],
    reduce      : list =>
        list.length
    ,
}

module.exports = { todo: { list, length } }