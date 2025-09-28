const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>✅ Server Test Successful!</h1>
    <p>Your Au Pair Questionnaire System should work fine.</p>
    <p>Time: ${new Date().toISOString()}</p>
    <p>Try accessing: <a href="http://localhost:3000">http://localhost:3000</a></p>
  `);
});

const port = 3002;
server.listen(port, () => {
  console.log(`✅ Test server running at http://localhost:${port}`);
  console.log('If this works, the issue might be with Next.js configuration.');
});