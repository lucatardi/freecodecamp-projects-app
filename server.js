// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

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
app.get("/whoami", function (req, res) {
  res.sendFile(__dirname + '/views/whoami.html');
});

app.get("/api/whoami", function (req, res) {
  const info = {
    ipaddress: req.headers['x-forwarded-for'],
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  }
  res.json(info);
});


// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
