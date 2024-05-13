const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/robot-management', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Schema for User
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  // Add more fields as needed
});

// Define Schema for Robot
const robotSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  batteryLevel: Number,
  status: String,
  activityLog: String
});

// Create User model
const User = mongoose.model('users', userSchema);

// Create Robot model
const Robot = mongoose.model('robots', robotSchema);

// Create empty collections
async function createEmptyCollections() {
  try {
    await User.createCollection();
    console.log('Users collection created');
    await Robot.createCollection();
    console.log('Robots collection created');
  } catch (error) {
    console.error('Error creating collections:', error);
  }
}

// Call the function to create empty collections
createEmptyCollections();