const express = require('express');

const cors = require('../middlware/cors');

const drop_user_collection = require('../db_ops/user_op').drop_user_collection;

const remove_user_router = express.Router();

remove_user_router.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.delete(cors.cors_allow_whitelist, (req, res, next)=>{
    
    drop_user_collection((err, result)=>{
        if(err != null){
            next(err);
        }else{
            res.statusCode = 200;
            res.json(result);
        }
    });
});

module.exports = remove_user_router;