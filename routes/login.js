// 3rd party
const express = require('express');
const cors = require('../middlware/cors');

const generate_token = require('../utilities/token_op').generate_token;
const get_value = require('../utilities/utilities').get_value;
const dbOp = require('../db_models/amazon_db_instance').dbOp;
const bcrypt = require('bcrypt');
const login_router = express.Router();

login_router.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let username = get_value(req.body, 'username');
    let password = get_value(req.body, 'password');
    if(password == null || username == null){
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "missing fields."});
        return;
    }
    dbOp.queryUserByUsername(username, ['id', 'username', 'hash_password'])
    .then(user => {
        bcrypt.compare(password, user.hash_password, (err, same)=>{
            if(err != null){
                err.statusCode = 500;
                next(err);
            }else if(!same){
                let new_err = new Error("Invalid username or password");
                new_err.statusCode = 400;
                next(new_err);
            }else{
                // return token
                res.statusCode = 200;
                res.json({success: true, token: generate_token({
                    id: user.id,
                    username: user.username
                })});
            }
        });
    })
    .catch(err => {
        if(err.message == 'nodata'){
            let new_err = new Error("Invalid username or password");
            new_err.statusCode = 400;
            next(new_err);
        }else{
            err.statusCode = 500;
            next(err);
        }
    })
});

module.exports = login_router;