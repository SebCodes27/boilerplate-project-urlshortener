require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let test = 'test';
  let originalURL = req.body.url;
  let shortUrl = originalURL;
  res.json({
    original_url: originalURL,
    short_url: test
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
