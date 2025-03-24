const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member must have a name']
  },
  title: {
    type: String,
    required: [true, 'Team member must have a title']
  },
  image: String,
  description: String,
  order: {
    type: Number,
    default: 0
  }
});

const aboutSchema = new mongoose.Schema({
  mission: {
    type: String,
    required: [true, 'Mission statement is required']
  },
  values: [{
    type: String
  }],
  history: String,
  teamMembers: [teamMemberSchema]
}, {
  timestamps: true
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;