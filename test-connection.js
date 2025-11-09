const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');

// Add more detailed error handling
mongoose.connect('mongodb://127.0.0.1:27017/solvent-ai-db', {
  serverSelectionTimeoutMS: 5000 // 5 second timeout
})
.then(() => {
  console.log('Successfully connected to MongoDB!');
  process.exit(0);
})
.catch(error => {
  console.error('Failed to connect to MongoDB. Error details:');
  console.error(error);
  process.exit(1);
});