const { saveToExcel } = require('./server.js');

// Test data
const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    message: 'This is a test message',
    source: 'test',
};

// Test the saveToExcel function
async function testSaveToExcel() {
    try {
        console.log('Testing Excel save functionality...');
        console.log('Test data:', testData);
        
        const result = await saveToExcel(testData);
        console.log('Save completed successfully:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testSaveToExcel();