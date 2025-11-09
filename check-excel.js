const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcelData(retries = 3) {
  try {
    // Path to your Excel file
    const excelPath = path.join(__dirname, 'contact_forms.xlsx');
    
    console.log('Reading Excel file...');
    const workbook = new ExcelJS.Workbook();
    
    try {
      await workbook.xlsx.readFile(excelPath);
    } catch (readError) {
      if (readError.code === 'ENOENT') {
        console.log('Excel file not found yet, waiting for it to be created...');
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return checkExcelData(retries - 1);
        }
        throw new Error('Excel file was never created');
      }
      throw readError;
    }
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('No worksheet found in Excel file');
    }
    
    // Get the last row
    const lastRow = worksheet.lastRow;
    if (!lastRow) {
      console.log('❌ No data found in Excel file');
      return;
    }

    // Print some stats
    console.log(`\nTotal submissions: ${worksheet.rowCount - 1}`);  // -1 for header row
    
    // Print the column headers
    const headers = worksheet.getRow(1).values;
    console.log('\nColumns:', headers.slice(1).join(', '));  // slice(1) to remove the first undefined value

    // Print the last submission
    const lastSubmission = lastRow.values;
    console.log('\nMost recent submission:');
    headers.forEach((header, index) => {
      if (index > 0) { // Skip the first undefined value
        console.log(`${header}: ${lastSubmission[index]}`);
      }
    });

    // Check timestamp to verify if it's our test submission
    const timestampIndex = headers.indexOf('timestamp');
    const submissionTime = new Date(lastSubmission[timestampIndex]);
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    if (submissionTime > oneMinuteAgo) {
      console.log('\n✅ Success! Found the test submission in Excel.');
      console.log(`Time saved: ${submissionTime.toLocaleString()}`);
    } else {
      console.log('\n⚠️ Warning: Last submission is older than 1 minute.');
      console.log('Time of last submission:', submissionTime.toLocaleString());
      console.log('Current time:', new Date().toLocaleString());
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (retries > 0) {
      console.log(`\nRetrying in 2 seconds... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return checkExcelData(retries - 1);
    }
  }
}

// Wait a few seconds for the form submission to be processed before checking Excel
setTimeout(() => {
  console.log('Checking Excel file for the test submission...');
  checkExcelData();
}, 3000);