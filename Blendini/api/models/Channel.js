// Channel.js
// The set of LED channels.
module.exports = {
  attributes: {

    color: {
      type: 'string',
      required: true
    },

    red: {
      type: 'integer',
      required: true,
      defaultsTo: 0,
      min: 0,
      max: 255
    },

    green: {
      type: 'integer',
      required: true,
      defaultsTo: 0,
      min: 0,
      max: 255
    },

    blue: {
      type: 'integer',
      required: true,
      defaultsTo: 0,
      min: 0,
      max: 255
    },

    value: {
      type: 'integer',
      defaultsTo: 0,
      min: 0,
      max: 4095
    },

    port: {
      type: 'integer',
      required: true,
      min: 0, 
      max: 5
    }

  }
}