const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true);
//mongoose.set('debug', true);

const config = {
    "mongodb_url": "mongodb://qinnan.dev:27017/cs6400_project",
    "server_domain": "localhost",
    "server_port":9000,
}

const connect = mongoose.connect(config.mongodb_url, {});


const productRoute = require('./routes/product');
const productMetaRoute = require('./routes/productmeta');
///////// Express middleware //////////

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Route setup         /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
function launchServer(app, port, domain){
    // user and account
    let urlprefix = "/api/v1.0"
    app.use(urlprefix + '/product', productRoute);
    app.use(urlprefix + '/product-meta', productMetaRoute);
    app.use((req, res, next) => {
        res.status(404).send('Your request is not supported currently.')
    })
    app.use((err, req, res, next)=>{
        res.status(400).send(err.message);
    })
    console.log("[server] route setup.");

    require('http').createServer(app).listen(port, domain);
    console.log(`LinuxMonitor server is running at http://${domain}:${port}`);
}



connect.then((db)=>{
        console.log("[mongodb] connected correctly to server");
        launchServer(app, config.server_port, config.server_domain);
    }, (err)=>{
        console.log("[mongodb] connection failed")
        console.log(err);
});




//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


