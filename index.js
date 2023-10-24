require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sebastiangarciawork02:Shmongo42%2A@cluster0.p3lqwvg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const dns = require('dns'); 

// VISIT here for how to connect Mongoose https://dev.to/franciscomendes10866/setup-mongodb-with-mongoose-and-express-4c58

// Mongoose code

let UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  fixedUrl: {
    type: String,
    required: true
  }
});

let Url = mongoose.model('Url', UrlSchema);

let options = {
  all: true,
};

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

app.use('/api/shorturl', bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl', async (req, res) => {
  let originalURL = req.body.url;
  Url.find()
  .then((data) => {
    let dataLength = data.length;
    return dataLength;
  })
  .then((fixedURL) => {
    let newUrl = new Url({ originalUrl: originalURL, fixedUrl: fixedURL });
    console.log(newUrl);
    return newUrl;
  })
  .then((savedUrl) => {
    let saved = savedUrl.save();
    return saved;
  })
  .then((data) => {
    let replaceReg1 = /^https:?:\/\//i;
    let replaceReg2 = /^http:?:\/\//i;
    let replace1 = originalURL.replace(replaceReg1, '');
    let replace2 = replace1.replace(replaceReg2, '');
    dns.lookup(replace2, (err) => {
      if (err && err.code === 'ENOTFOUND') {
        res.json({
          'error': 'invalid url'
        })
      } else {
        res.json({
          original_url: originalURL,
          short_url: data.fixedUrl
        })
      }
    })
  })
});

app.get('/api/shorturl/:num?', async (req, res) => {
  let num = Number(req.params.num)
  Url.findOne({fixedUrl: num })
  .then((docs)=>{
      let redirect = docs.originalUrl;
      res.redirect(redirect);
      console.log('success');
  })
  .catch((err)=>{
      res.send(err);
      console.log('failure');
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
