// LightState.js
// The state of the channels at a point in time.
module.exports = {
  attributes: {

    time: {
      type: 'datetime',
      required: true
    },
    
    values: {
      type: 'array',
      required: true
    },

    schedule: {
      model: 'schedule'
    }

  }
}