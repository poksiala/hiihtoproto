const rpio = require('rpio')

rpio.open(4, rpio.INPUT)
setInterval(() => {
    console.log(`Pin 4 state is: ${rpio.read(4)}`)
}, 1000)
