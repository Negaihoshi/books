let express = require('express');
let app = express();
let bodyParser = require('body-parser')
let request = require('request');
let cheerio = require('cheerio');
let url = require('url');
let log4js = require('log4js');
log4js.replaceConsole();

let requestAPI = (url) => {
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (error) {
        return reject(error);
      }

      return resolve(body);
    });
  });
}

var isEbook = function(string){
  let chineseList = ["電子書", "二手書"];
  for (var i = 0; i < chineseList.length; i++) {
    if (string.indexOf(chineseList[i]) > -1) {
      return chineseList[i];
    }
  }
  return '實體書';
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/url', function (req, res, next) {
  let urlParse = url.parse(req.body.path);
  console.log(urlParse.hostname);
  switch (urlParse.hostname) {
    case 'www.taaze.tw':
    requestAPI(req.body.path).then((data) => {
      let $ = cheerio.load(data);
      let bookName =  $('body > div:nth-child(37) > h1:nth-child(1)').text();
      let originPrice = $('#prodInfo3 > li:nth-child(2) > span:nth-child(3)').text();
      let discount = $('#prodInfo3 > li:nth-child(3) > span:nth-child(1) > span:nth-child(1)').text();
      let disCountPrice = $('#prodInfo3 > li:nth-child(3) > span:nth-child(2) > span:nth-child(1)').text();
      // return originPrice + '_' + discount + '_'  + disCountPrice;
      res.send('讀冊' + ' ' + bookName + '_' + originPrice + '_' + discount + '_'  + disCountPrice + '_' + isEbook(bookName));
    });
    break;
    case 'www.books.com.tw':
    requestAPI(req.body.path).then((data) => {
      let $ = cheerio.load(data);
      let bookName =  $('.type02_p002 > h1:nth-child(1)').text();
      let originPrice = $('.price > li:nth-child(1) > em:nth-child(1)').text();
      let discount = $('.price > li:nth-child(2) > strong:nth-child(1) > b:nth-child(1)').text();
      let disCountPrice = $('.price01 > b:nth-child(2)').text();
      // return originPrice + '_' + discount + '_'  + disCountPrice;
      res.send('博客來' + ' ' + bookName + '_' + originPrice + '_' + discount + '_'  + disCountPrice + '_' + isEbook(bookName));
    });
    break;
    case 'store.readmoo.com':
    requestAPI(req.body.path).then((data) => {
      let $ = cheerio.load(data);
      let bookName =  $('.book-meta-box > h1:nth-child(1)').text();
      let originPrice = $('div.price:nth-child(1) > del:nth-child(1) > strong:nth-child(1)').text();
      let disCountPrice = $('div.price:nth-child(3) > strong:nth-child(1)').text();
      let discount = (disCountPrice / originPrice) * 100;
      // return originPrice + '_' + discount + '_'  + disCountPrice;
      res.send('Readmoo' + ' ' + bookName + '_' + originPrice + '_' + discount + '_'  + disCountPrice + '_' + '電子書');
    });
      break;
    case 'www.tenlong.com.tw':
    requestAPI(req.body.path).then((data) => {
      let $ = cheerio.load(data);
      let bookName =  $('.item_title').text();
      let originPrice = $('.item_description > li:nth-child(3) > del:nth-child(2)').text();
      let disCountPrice = $('span.pricing:nth-child(3)').text();
      let discount = $('span.pricing:nth-child(2)').text();
      console.info('書名：', bookName);
      console.info('原始金額：', originPrice);
      console.info('折扣後金額：', disCountPrice);
      console.info('折扣：', discount);
      // return originPrice + '_' + discount + '_'  + disCountPrice;
      res.send('天瓏' + ' ' + bookName + '_' + originPrice + '_' + discount + '_'  + disCountPrice + '_' + '實體書');
    });
      break;
    default:
    res.send('not support this website');
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
