const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/solvent-ai-db')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Define the schema
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
      message: String,
      source: String,
      timestamp: Date
    });

    // Create the model
    const Contact = mongoose.model('Contact', contactSchema);

    try {
      // Fetch all contacts
      const contacts = await Contact.find({});
      console.log('\nStored Contacts:');
      console.log('---------------');
      
      if (contacts.length === 0) {
        console.log('No contacts found in the database.');
      } else {
        contacts.forEach(contact => {
          console.log(`\nName: ${contact.name}`);
          console.log(`Email: ${contact.email}`);
          console.log(`Phone: ${contact.phone}`);
          console.log(`Message: ${contact.message}`);
          console.log(`Source: ${contact.source}`);
          console.log(`Timestamp: ${contact.timestamp}`);
          console.log('---------------');
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });