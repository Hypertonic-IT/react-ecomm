// const fetch = require('node-fetch'); // Removed
// Or just use http module. Let's use http to be safe.
const http = require('http');

const data = JSON.stringify({
    email: 'testuser@example.com'
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/send-otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("Sending request to localhost:5001...");

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let body = '';

    res.on('data', d => {
        body += d;
    });

    res.on('end', () => {
        console.log("Response:", body);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
