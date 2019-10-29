const express = require('express');

// 1
const posts = require('./data/posts');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

// 2
server.use('/api/posts', posts);

server.listen(2000, () => {
  console.log('\n*** Server Running on http://localhost:2000 ***\n');
});
