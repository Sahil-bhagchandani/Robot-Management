const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  batteryLevel: Number,
  status: String,
  activityLog: String
});

const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;

