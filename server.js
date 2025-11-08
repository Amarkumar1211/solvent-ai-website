const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solvent-ai-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    source: String, // 'contact' or 'footer'
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

// API endpoints
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Contact information saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving contact information' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});