
require('file?name=index.html!./index.html')

import 'mocha/mocha.css'


// load mocha script as inline
const script_mocha = document.createElement('script')
script_mocha.innerHTML = require('raw!mocha/mocha.js')
document.body.appendChild( script_mocha )


mocha.setup({
    ui          :   'bdd',
    timeout     :   500000,
})

const script_spec = document.createElement('script')
script_spec.setAttribute('src', 'test-spec.js')
document.body.appendChild( script_spec )

script_spec.onload = () => {
    mocha.checkLeaks()
    mocha.run()
}
