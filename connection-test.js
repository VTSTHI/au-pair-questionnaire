const http = require('http');

console.log('🔍 Testing connection to Next.js server...');

const testConnection = (port) => {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      console.log(`✅ Port ${port}: Status ${res.statusCode}`);
      console.log(`📄 Headers:`, res.headers);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📝 Response preview: ${data.substring(0, 200)}...`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Port ${port}: ${err.message}`);
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ Port ${port}: Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
};

// Test multiple ports
const testPorts = [3000, 3002, 4000, 8080];

Promise.allSettled(testPorts.map(port => testConnection(port)))
  .then(results => {
    console.log('\n🎯 Test completed!');
    results.forEach((result, i) => {
      const port = testPorts[i];
      if (result.status === 'fulfilled') {
        console.log(`✅ Port ${port}: Working`);
      } else {
        console.log(`❌ Port ${port}: Failed`);
      }
    });
  });