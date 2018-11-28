const rpio = require('rpio')

const BIOPIN = 7
const MIXEDPIN = 8
const PIN_NAMES = {7: 'bio', 8: 'mixed'}
const PINS = [BIOPIN, MIXEDPIN]


const handlePinChange = (pin) => {
    const state = (rpio.read(pin) === 1)
    const name = PIN_NAMES[pin]
    console.log(name, state)  
}

PINS.forEach((id) => {
  rpio.open(id, rpio.INPUT)
  rpio.poll(id, handlePinChange)
