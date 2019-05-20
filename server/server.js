const express = require('express');
const request = require('request');
const jwt = require('express-jwt');
const app = express();
const PORT = process.env.PORT || 3001;

const exchanges = {
    coindesk: '',
    blockchain: '',
    coinbase: '',
    bitstamp: '',
    bitpay: ''
}

const averageRate = {
    rate: ''
}

setInterval(function() {
    let counter = 0;
    let summRate = 0;
    coindesk = new Promise((resolve, reject) => {
        request(`https://api.coindesk.com/v1/bpi/currentprice/btc.json`, function(err, response, rate) {
            if (err) {
                reject(err);
            } else {
                resolve(exchanges.coindesk = JSON.parse(rate),
                    exchanges.coindesk = exchanges.coindesk.bpi.USD.rate);
            }
        })
    });
    blockchain = new Promise((resolve, reject) => {
        request(`https://blockchain.info/ticker`, function(err, response, rate) {
            if (err) {
                reject(err);
            } else {
                resolve(exchanges.blockchain = JSON.parse(rate),
                    exchanges.blockchain = exchanges.blockchain.USD.last);
            }
        })
    });
    coinbase = new Promise((resolve, reject) => {
        request(`https://api.coinbase.com/v2/prices/spot?currency=USD`, function(err, response, rate) {
            if (err) {
                reject(err);
            } else {
                resolve(exchanges.coinbase = JSON.parse(rate),
                    exchanges.coinbase = exchanges.coinbase.data.amount);
            }
        })
    });
    bitstamp = new Promise((resolve, reject) => {
        request(`https://www.bitstamp.net/api/v2/ticker/btcusd/`, function(err, response, rate) {
            if (err) {
                reject(err);
            } else {
                resolve(exchanges.bitstamp = JSON.parse(rate),
                    exchanges.bitstamp = exchanges.bitstamp.last);
            }
        })
    });
    bitpay = new Promise((resolve, reject) => {
        request(`https://bitpay.com/api/rates`, function(err, response, rate) {
            if (err) {
                reject(err);
            } else {
                resolve(exchanges.bitpay = JSON.parse(rate),
                    exchanges.bitpay = exchanges.bitpay[2].rate);
            }
        })
    });

    Promise.all([coindesk, blockchain, coinbase, bitstamp, bitpay]).then(() => {
        exchanges.coindesk = exchanges.coindesk.replace(',', '')
        Object.keys(exchanges).forEach(function(key) {
            exchanges[key] = parseFloat(exchanges[key]);
            summRate += exchanges[key];
            counter += 1;
        })
        averageRate.rate = summRate / counter;
        console.log(averageRate.rate);
    });
}, 60000);


app.get('/api', (req, res) => {
    res.json({
        exchanges,
        averageRate
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
