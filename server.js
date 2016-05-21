let express = require('express');
let app = express();
let bodyParser = require('body-parser')
let request = require('request');
let parse5 = require('parse5');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/url', function (req, res, next) {
  console.log(req.body);
  // res.json(req.body);

  request(req.body.path, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body) // Show the HTML for the Google homepage.

      let document     = parse5.parse(body);
      let documentHtml = parse5.serialize(document);
      // console.log(documentHtml);
      res.send(documentHtml);
    }
  })

});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
