const mongoose = require('mongoose');
const schema = mongoose.Schema({
  authorName: {
    type: String,
    required: true
  },

  publicationTitle: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('blogpost', schema);
