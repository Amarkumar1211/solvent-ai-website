const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/solvent-ai-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
    
    // Create a test entry
    const Contact = mongoose.model('Contact', {
        name: String,
        email: String,
        phone: String,
        message: String,
        source: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    });

    // Create a test contact
    const testContact = new Contact({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'This is a test message',
        source: 'test'
    });

    // Save the test contact
    return testContact.save();
})
.then(() => {
    console.log('Test contact saved successfully!');
    process.exit(0);
})
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});