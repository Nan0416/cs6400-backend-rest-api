const express = require('express');
const cors = require('../middlware/cors');

const generate_token = require('../utilities/token_op').generate_token;
const get_value = require('../utilities/utilities').get_value;
const has_null = require('../utilities/utilities').has_null;
const dbOp = require('../db_models/amazon_db_instance').dbOp;
const signup_router = express.Router();

signup_router.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let username = get_value(req.body, 'username');
    let password = get_value(req.body, 'password');
    if(has_null(username, password)){
        res.statusCode = 400; 
        res.json({success: false, reason: "missing fields."});
        return;
    }
    dbOp.signupUser(username, password)
    .then(user => {
        res.statusCode = 200;
        res.json({success: true, token: generate_token(user)});
    })
    .catch(err => {
        next(err);
    });
});

module.exports = signup_router;