// server.js
// where your node app starts

// init project
const express = require('express'),
  mongo = require('mongodb'),
  mongoose = require('mongoose'),
  shortid = require('shortid'),
  bodyParser = require('body-parser');

var app = express();
const PORT = process.env.PORT || 3000;

const DB_URI = 'mongodb+srv://luca:luca@cluster0.51xak.mongodb.net/Cluster0?retryWrites=true&w=majority';
mongoose.connect(DB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// timestamp project

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + '/views/timestamp.html');
});

app.get("/timestamp/api/:date?", function (req, res) {
  const inputDate = req.params.date;
  if (!inputDate) {
    const actualDate = new Date();
    res.json({
      unix: Date.parse(actualDate),
      utc: actualDate.toGMTString()
    });
  } else {
    const formattedDate = new Date(isNaN(inputDate) ? inputDate : +inputDate);
    if(!isNaN(formattedDate)) {
      res.json({
        unix: Date.parse(formattedDate),
        utc: formattedDate.toGMTString()
      });
    } else {
      res.json({ error : 'Invalid Date' });
    }
  }
});

// header parser project
app.get("/headerparser", function (req, res) {
  res.sendFile(__dirname + '/views/headerparser.html');
});

app.get("/headerparser/api/whoami", function (req, res) {
  const info = {
    ipaddress: req.headers['x-forwarded-for'],
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  }
  res.json(info);
});

// url shortener project
app.get("/urlshortener", function (req, res) {
  res.sendFile(__dirname + '/views/urlshortener.html');
});

// Create a schema and model to store URLs
const ShortUrl = mongoose.model('ShortUrl',
new mongoose.Schema({
  original_url: String,
  short_url: String,
  suffix: String
}))

app.post("/urlshortener/api/shorturl", async (req, res) => {
  const suffix = shortid.generate();
  const newUrl = new ShortUrl({
    original_url: req.body.url,
    short_url: __dirname + '/urlshortener/api/shorturl/' + suffix,
    suffix,
  })

  const saved = await newUrl.save();
  res.json(saved);
}); 

app.get("/urlshortener/api/shorturl/:suffix", async (req, res) => {
  const suffix = req.params.suffix;
  const found = await ShortUrl.findOne({suffix: suffix});
  console.log(found);
  found && res.redirect(found.original_url);
});

// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
