const http = require('http');

const data = JSON.stringify({
  name: 'Automated Test',
  email: 'test+local@example.com',
  phone: '9999999999',
  company: 'LocalTestCo',
  topic: 'automation',
  message: 'This is a local test submission',
  source: 'contact'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  console.log('STATUS:', res.statusCode);
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error('problem with request:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
