const express = require('express');
const productRouter = express.Router();
const dbOp = require('../db_models/amazon_db_instance').dbOp;
const to_non_negative = require('../utilities/utilities').to_non_negative;
const cors = require('../middlware/cors');
const es_config = require('../config').elasticsearch_config;
const { Client } = require('@elastic/elasticsearch');
const ProductSearch = require('../elasticsearch/ProductSearch');
const client = new Client({node: es_config.domain});
const productSearch = new ProductSearch(client);
//659829
productRouter.route("/_postgres")
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
    productSearch.queryProductById(req.query.id)
    .then(v => {
        let data_ = v.body.hits.hits;
        if(data_.length == 0){
            res.statusCode = 404;
            res.json({success: false, reason: "product not found"});
        }else{
            let data = data_[0]._source;
            data['asin'] = data_[0]._id;

            res.statusCode = 200;
            res.json({success: true, product: data});
        }
    })
    .catch(err => {
        res.statusCode = 500;
        res.json({success: false, reason: err.message}); 
    });
})
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    if(req.body.search == null){
        res.statusCode = 400;
        res.json({
            success: false,
            reason:"bad query request."
        });
        return;
    }
    let limit = to_non_negative(req.query.limit);
    limit = limit != null? limit:10;
    let offset = to_non_negative(req.query.offset);
    offset = offset != null? offset: 0;
    productSearch.searchProduct(req.body.search, limit = limit, offset = offset)
    .then(v => {
        let total = v.body.hits.total.value;
        let max_score = v.body.hits.max_score;
        results = v.body.hits.hits;
        res.statusCode = 200;
        let data = [];
        for(let i = 0; i < results.length; i++){
            data.push(results[i]._source);
            data[i]['asin'] = results[i]._id;
            data[i]['_relevance'] = results[i]._score / max_score;
        }
        res.json({
            total: total,
            limit: limit,
            offset: offset,
            actual_number: results.length,
            data: data
        });
    })
    .catch(e => {
        res.statusCode = 500;
        res.json({success: false, message: e.message});
    });
});
module.exports = productRouter;