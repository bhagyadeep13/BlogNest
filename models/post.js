const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
  },
  authorName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technology', 'Education', 'Health', 'Lifestyle', 'Others']
  },
  photo : String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Home', homeSchema);
