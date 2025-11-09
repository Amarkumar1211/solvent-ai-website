const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Path to Excel file
const excelPath = path.join(__dirname, 'contact_forms.xlsx');

// Function to save form data to Excel
async function saveToExcel(data) {
  const workbook = new ExcelJS.Workbook();
  
  try {
    await workbook.xlsx.readFile(excelPath);
  } catch (error) {
    // If file doesn't exist, create a new workbook
    const worksheet = workbook.addWorksheet('Form Submissions');
    worksheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Company', key: 'company' },
      { header: 'Topic', key: 'topic' },
      { header: 'Message', key: 'message' },
      { header: 'Source', key: 'source' },
      { header: 'Timestamp', key: 'timestamp' }
    ];
  }

  const worksheet = workbook.getWorksheet(1);
  worksheet.addRow(data);
  await workbook.xlsx.writeFile(excelPath);
}

// API endpoint for form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Save to Excel
    await saveToExcel(formData);

    res.json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ message: 'Error saving form data' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});