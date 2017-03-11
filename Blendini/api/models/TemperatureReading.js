// TemperatureReading.js
// The state of the channels at a point in time.
module.exports = {
  attributes: {

    time: {
      type: 'datetime',
      required: true
    },
    
    probe: {
      type: 'integer',
      required: true
    },

    celcius: {
      type: 'float',
      required: true
    }

  }
}