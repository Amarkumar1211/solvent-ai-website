const testForm = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Excel Test User',
        email: 'exceltest@example.com',
        phone: '9876543210',
        message: 'Testing Excel file creation',
        source: 'test'
      })
    });

    const data = await response.json();
    console.log('Success:', data);
    
    // Wait a moment and then check the Excel file
    setTimeout(() => {
      console.log('\nChecking Excel file...');
      require('./check-excel.js');
    }, 1000);
  } catch (error) {
    console.error('Error:', error);
  }
};

testForm();