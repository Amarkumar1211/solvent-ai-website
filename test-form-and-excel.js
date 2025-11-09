// Use global fetch since Node.js 18+
// Test form data
const testFormData = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1987654321',
  company: 'ABC Corp',
  topic: 'Partnership',
  message: 'Testing form submission and Excel storage',
  source: 'contact',
  timestamp: new Date().toISOString()
};

async function testFormSubmission(retries = 3) {
  try {
    console.log('Submitting test form data...');
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData)
    });

    const data = await response.json();
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Form submission successful!');
      return true;
    } else {
      throw new Error(data.message || 'Form submission failed');
    }
  } catch (error) {
    console.error(`Attempt failed:`, error.message);
    
    if (retries > 0) {
      console.log(`Retrying in 2 seconds... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return testFormSubmission(retries - 1);
    } else {
      console.error('❌ All attempts failed');
      return false;
    }
  }
}

// Run the test with retries
testFormSubmission();