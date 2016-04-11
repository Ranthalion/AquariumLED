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
      defaultsTo: 0
    },

    green: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },

    blue: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },

    value: {
      type: 'integer',
      defaultsTo: 0
    },

    port: {
      type: 'integer',
      required: true
    }

  }
}