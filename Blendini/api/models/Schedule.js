// Schedule.js
// The set of LED channels.
module.exports = {
  attributes: {

    time: {
      type: 'time',
      required: true
    },
    
    values: {
      type: 'array',
      required: true
    }

  }
}