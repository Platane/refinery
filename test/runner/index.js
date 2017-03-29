
import 'file-loader?name=index.html!./index.html'

import 'style-loader!css-loader!mocha/mocha.css'


// load mocha script as inline
const script_mocha = document.createElement('script')
script_mocha.innerHTML = require('raw-loader!mocha/mocha.js')
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
