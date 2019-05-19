const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 3001;

let coindeskBTC;
let blockchainBTC;
let coinbaseBTC;
let bitstampBTC;
let bitpayBTC;
let averageRate;
let counter = 1;


  setInterval(function(){
  coindesk = new Promise((resolve, reject) => {
    request(`https://api.coindesk.com/v1/bpi/currentprice/btc.json`, function (err, response, rate) {
       if (err) {
           reject(err);
       } else {
           resolve(coindeskBTC = JSON.parse(rate));
           console.log('1 coindesk -- OK'); // coindeskBTC.bpi.USD.rate
       }
    })
  });
  blockchain = new Promise((resolve, reject) => {
    request(`https://blockchain.info/ticker`, function (err, response, rate) {
       if (err) {
           reject(err);
       } else {
           resolve(blockchainBTC = JSON.parse(rate));
           console.log('2 blockchain--OK'); //  blockchainBTC.USD.last
       }
    })
  });
  coinbase = new Promise((resolve, reject) => {
    request(`https://api.coinbase.com/v2/prices/spot?currency=USD`, function (err, response, rate) {
       if (err) {
           reject(err);
       } else {
           resolve(coinbaseBTC = JSON.parse(rate));
           console.log('3 coinbase -- OK'); //  coinbaseBTC.data.amount
       }
    })
  });
  bitstamp = new Promise((resolve, reject) => {
    request(`https://www.bitstamp.net/api/v2/ticker/btcusd/`, function (err, response, rate) {
       if (err) {
           reject(err);
       } else {
           resolve(bitstampBTC = JSON.parse(rate));
           console.log('4 bitstamp -- OK');  // bitstampBTC.last
       }
    })
  });
  bitpay = new Promise((resolve, reject) => {
    request(`https://bitpay.com/api/rates`, function (err, response, rate) {
       if (err) {
           reject(err);
       } else {
           resolve(bitpayBTC = JSON.parse(rate));
           console.log('5 bitpay  --  OK'); //  bitpayBTC[2].rate
       }
    })
  });

  Promise.all([coindesk,blockchain,coinbase,bitstamp,bitpay]).then(() => {
  console.log('---PROMISE -- OK')
  console.log(coindeskBTC.bpi.USD.rate);
  console.log(blockchainBTC.USD.last);
  console.log(coinbaseBTC.data.amount);
  console.log(bitstampBTC.last);
  console.log(bitpayBTC[2].rate);
  console.log('---RATES  --  OK');
  averageRate = (parseFloat(coindeskBTC.bpi.USD.rate.replace(/,/g,'')) + parseFloat(blockchainBTC.USD.last) + parseFloat(coinbaseBTC.data.amount) + parseFloat(bitstampBTC.last) + parseFloat(bitpayBTC[2].rate)) / 5;
  console.log(averageRate);
  console.log('---AVERAGE -- OK')
  console.log('----------------------')
  });
 }, 600000);



  app.get('', (req, res) => {
    res.send()
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
