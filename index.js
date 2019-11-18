const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const server_config = require('./config').server_config;
//const productRoute = require('./routes/product');
//const productMetaRoute = require('./routes/productmeta');
const userSignupRoute = require('./routes/signup');
const userLoginRoute = require('./routes/login');
//const userDropRoute = require('./routes/remove_user');
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
    let urlprefix = "/api/v2.0"
    //app.use(urlprefix + '/product', productRoute);
    //app.use(urlprefix + '/product-meta', productMetaRoute);
    app.use(urlprefix + '/user/login', userLoginRoute);
    app.use(urlprefix + '/user/signup', userSignupRoute);
    //app.use(urlprefix + '/user', userDropRoute);
    app.use((req, res, next) => {
        res.status(404).send('Your request is not supported currently.')
    })
    app.use((err, req, res, next)=>{
        if(err.statusCode != null){
            res.statusCode = err.statusCode;
        }else{
            res.statusCode = 400;
        }
        res.json({success: false, reason: err.message});
    });
    console.log("[server] route setup.");

    require('http').createServer(app).listen(port, domain);
    console.log(`LinuxMonitor server is running at http://${domain}:${port}`);
}

launchServer(app, server_config.port, server_config.domain);




//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


