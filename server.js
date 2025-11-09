const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProduction ? ['https://solventinteractive.com', 'https://www.solventinteractive.com'] : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solvent-ai-db')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Function to save to Excel
const saveToExcel = async (contactData) => {
    try {
        const filePath = path.join(__dirname, 'contact_submissions.xlsx');
        console.log('Excel file path:', filePath);

        // Initialize workbook and data array
        let workbook = XLSX.utils.book_new();
        let data = [];

        // Try to read existing file if it exists
        if (fs.existsSync(filePath)) {
            try {
                workbook = XLSX.readFile(filePath);
                if (workbook.SheetNames.length > 0) {
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    if (worksheet) {
                        data = XLSX.utils.sheet_to_json(worksheet);
                        console.log('Existing data loaded:', data.length, 'records');
                    }
                }
            } catch (readError) {
                console.warn('Could not read existing file, creating new one:', readError.message);
            }
        }

        // Add new entry
        const newEntry = {
            Name: contactData.name || '',
            Email: contactData.email || '',
            Phone: contactData.phone || '',
            Message: contactData.message || '',
            Source: contactData.source || '',
            Timestamp: new Date().toLocaleString()
        };
        data.push(newEntry);
        console.log('Added new entry:', newEntry);

        // Create new worksheet with updated data
        const ws = XLSX.utils.json_to_sheet(data);
        
        // Remove existing sheet if it exists
        const sheetName = 'Contacts';
        if (workbook.SheetNames.includes(sheetName)) {
            // Remove existing sheet
            const idx = workbook.SheetNames.indexOf(sheetName);
            workbook.SheetNames.splice(idx, 1);
            delete workbook.Sheets[sheetName];
        }
        
        // Add the new worksheet
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);
        
        // Save the file
        XLSX.writeFile(workbook, filePath);
        console.log('Excel file saved successfully with', data.length, 'total records');
        return true;
    } catch (error) {
        console.error('Error in saveToExcel:', error);
        throw error;
    }
};

// API endpoints
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body);

        // Save to MongoDB
        const contact = new Contact(req.body);
        await contact.save();
        console.log('Saved to MongoDB successfully');

        // Save to Excel
        try {
            await saveToExcel(req.body);
            console.log('Saved to Excel successfully');
        } catch (excelError) {
            console.error('Error saving to Excel:', excelError);
        }

        res.status(201).json({ message: 'Contact information saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Error saving contact information' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});