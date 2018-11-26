const rpio = require('rpio')

const BIOPIN = 7

rpio.open(BIOPIN, rpio.INPUT)
setInterval(() => {
    console.log(`Pin 4 state is: ${rpio.read(BIOPIN)}`)
}, 1000)
