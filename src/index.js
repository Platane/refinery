// import 'babel-polyfill'
// import 'whatwg-fetch'

import {Node as NodeAgregator}      from './node/agregator'

export class Node extends NodeAgregator {
    // static supportedProvider = [ 'soundcloud', 'youtube', 'deezer' ];
}

const global = ( typeof window != 'undefined' && window ) || ( typeof GLOBAL != 'undefined' && GLOBAL ) || this || {}

global.AgnosticPlayer = Node
