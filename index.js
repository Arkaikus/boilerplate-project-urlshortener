require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

const bp = require('body-parser');

// Put these statements before you define any routes.
app.use(bp.urlencoded());
app.use(bp.json());

// Basic Configuration
const port = 8000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = {};

app.get('/api/shorturl/:short_url?', function (req, res) {
  let short = req.params?.short_url

  console.log(short, "redirecting to", urls[short]);
  res.redirect(301, urls[short]);
});

app.post('/api/shorturl', function (req, res) {
  let { url } = req.body;
  console.log(url);
  if (!/^http.*/.test(url)) {
    console.log("invalid url")
    res.json({ error: 'invalid url' });
  } else {
    console.log("valid url")
    let shorten = Object.keys(urls).length + 1;
    urls[shorten] = url;
    res.json({ "original_url": url, "short_url": shorten });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
