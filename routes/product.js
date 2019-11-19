const express = require('express');
const productRouter = express.Router();
const dbOp = require('../db_models/amazon_db_instance').dbOp;
const cors = require('../middlware/cors');

productRouter.route("/")
.get(cors.cors_allow_whitelist, (req, res, next)=>{
    if(req.query.id == null){
        res.statusCode = 400;
        res.json({
            success: false,
            reason:"bad query request."
        });
        return;
    }
    dbOp.queryProductById(req.query.id)
    .then(product => {
        res.statusCode = 200;
        res.json({success: true, product: product});
    })
    .catch(err => {
        if(err.message == "not found"){
            res.statusCode = 404;
            res.json({success: false, reason: "product not found"});
        }else{
            res.statusCode = 500;
            res.json({success: false, reason: err.message});
        }
    })

});
module.exports = productRouter;