const XLSX = require('xlsx');

// Create a new workbook and worksheet
const wb = XLSX.utils.book_new();
const ws_data = [
  ['Name', 'Email', 'Phone', 'Message', 'Source', 'Timestamp'],
  ['Test User', 'test@example.com', '1234567890', 'Test Message', 'test', new Date().toLocaleString()]
];

const ws = XLSX.utils.aoa_to_sheet(ws_data);
XLSX.utils.book_append_sheet(wb, ws, "Contacts");

// Write to file
try {
  XLSX.writeFile(wb, 'contact_submissions.xlsx');
  console.log('Test Excel file created successfully!');
} catch (error) {
  console.error('Error creating Excel file:', error);
}