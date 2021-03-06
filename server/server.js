const express = require('express');
const request = require('request');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

const exchanges = {}

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
        let date = new Date();
        exchanges.coindesk = exchanges.coindesk.replace(',', '')

        Object.keys(exchanges).forEach(function(key) {
            exchanges[key] = parseFloat(exchanges[key]);
            summRate += exchanges[key];
            counter += 1;
        })
        exchanges.rate = summRate / counter;
        // exchanges.date = date;

        console.log(date);
        console.log(exchanges.rate);

        io.emit('rates', {
            exchanges
        })

    })
}, 10000)


let userOnline = 0;
io.on('connection', (socket) => {
    userOnline += 1;
    console.log(`User connected | Online: ${userOnline}`);

    socket.emit('rates', {
        exchanges
    })
    socket.on('disconnect', function() {
        userOnline -= 1;
        console.log(`User disconnected | Online: ${userOnline}`);
    })
})

app.get('/api/', (req, res) => {
    res.json({
        exchanges,
        averageRate
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
