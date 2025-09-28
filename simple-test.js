// Simple Next.js test
const { spawn } = require('child_process');

console.log('🔍 Testing Next.js manually...');

const next = spawn('npx', ['next', 'dev', '--port', '9999'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

next.stdout.on('data', (data) => {
  console.log('📤 STDOUT:', data.toString());
});

next.stderr.on('data', (data) => {
  console.log('📤 STDERR:', data.toString());
});

next.on('close', (code) => {
  console.log(`📤 Process exited with code ${code}`);
});

// Test connection after 5 seconds
setTimeout(() => {
  const http = require('http');
  const req = http.get('http://localhost:9999', (res) => {
    console.log('✅ Next.js is responding!');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    process.exit(0);
  });
  
  req.on('error', (err) => {
    console.log('❌ Connection failed:', err.message);
    process.exit(1);
  });
}, 5000);