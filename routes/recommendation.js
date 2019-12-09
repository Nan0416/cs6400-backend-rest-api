const express = require('express');
const recommendation = express.Router();
const request = require('request');
const cors = require('../middlware/cors');
const { EventHubClient} = require("@azure/event-hubs");
const event_hub_config = require('../config').eventHub;
//console.log(event_hub_config);
const event_hub_client = EventHubClient.createFromConnectionString(event_hub_config.connection_string, event_hub_config.eventhub_name);
const RecommendationHandler = require('../recommendation/RecommendationHandler');
const recommendation_handler = new RecommendationHandler(event_hub_client);
const product_asin_to_int = require('../utilities/product_asin_to_int').product_asin_to_int;
const product_int_to_asin = require('../utilities/product_asin_to_int').product_int_to_asin;

const to_non_negative = require('../utilities/utilities').to_non_negative;


const es_config = require('../config').elasticsearch_config;
const { Client } = require('@elastic/elasticsearch');
const ProductSearch = require('../elasticsearch/ProductSearch');
const client = new Client({node: es_config.domain});
const productSearch = new ProductSearch(client);


let user_str_to_num = new Map();
let user_num_to_str = new Map();
let user_session_recommend = new Map();
const user_num_id_base = 700000;
let user_id_count = 0;







let __mock_count = 0;
function mockGetRecommend(session_id){
    let value = to_non_negative(session_id);
    if(value == null){
        return Promise.reject(new Error(`Invalid Session ${session_id}`));
    }
    return new Promise((resolve, reject)=>{
        request({
            method: 'GET',
            url:'http://52.188.223.237:8000',
            headers: {
                'Content-Type': 'application/json'
            },
            json:{
                'userid': value
            }
        }, (err, res, body) =>{
            if(err != null || res.statusCode != 200){
                reject(new Error(`Invalid Session ${session_id}`));
            }else{
                let result = [];
                for(let i = 0; i < body.prods.length; i++){
                    result.push(product_int_to_asin[body.prods[i].toString()]);
                }
                // console.log(result);
                // console.log(body.prods);
                resolve(result);
            }
        });
    });
    

    /*if(user_session_recommend.has(session_id)){
        return Promise.resolve(user_session_recommend.get(session_id));
    }

    __mock_count += 1;
    if(__mock_count % 20 == 0){
        let rec = ["B000BQ7GW8", "B0006BB9MG", "B000A6PPOK", "B00004ZCJJ", "B00004ZCJI", "B00009KLAE", "B00020S7XK", "B0001LR1KU", "B000BTL0OA", "B000AA2RCY"];
        user_session_recommend.set(session_id, rec);
        return Promise.resolve(rec);
    }else{
        return Promise.resolve([]);
    }*/
}











function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

recommendation.route("/result")
.get(cors.cors_allow_whitelist, (req, res, next) => {
    if(req.query.userid == null || req.query.sessionid == null){
        res.statusCode = 400;
        res.json({
            success: false,
            reason: "miss userid/sessionid fields"
        });
        return;
    }
    mockGetRecommend(req.query.sessionid)
    .then( list => {
        //console.log("Recommend product asin : ", list);
        return productSearch.queryProductByIds(list)
        .then(v => {
            let products = [];
            _items = v.body.hits.hits;
            for(let i = 0; i < _items.length; i++){
                products.push(_items[i]._source);
                // console.log(`find ${_items[i]._id}`);
            }
            return products;
        });
    })
    .then( products => {
        res.statusCode = 200;
        res.json({
            success: true,
            include_data: products.length != 0,
            products: products
        });
    })
    .catch(err => {
        res.statusCode = 500;
        res.json({
            success: true,
            reason: err.message
        });
    })
});


recommendation.route("/start")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    if(req.query.userid == null || req.body.liked_products == null){
        res.statusCode = 400;
        res.json({
            success: false,
            reason:"miss user/liked_product fields"
        });
        return;
    }
    if(req.body.liked_products.length < 8){
        res.statusCode = 400;
        res.json({
            success: false,
            reason:"select more products (at least 8)"
        });
        return;
    }
    let product_int_id = [];
    for(let i = 0; i < req.body.liked_products.length; i++){
        let num_id = product_asin_to_int[req.body.liked_products[i]];
        if(num_id != null){
            product_int_id.push(num_id);
        }
    }
    console.log(req.body.liked_products)
    console.log(product_int_id)
    
    user_id_count += 1;
    let user_num_id = user_num_id_base + user_id_count;
    user_str_to_num.set(req.query.userid, user_num_id);
    user_num_to_str.set(user_num_id, req.query.userid);

    let session_id = getRandomInt(10000000).toString();
    // res.statusCode = 200;
    recommendation_handler.sendRequest(user_num_id, session_id, product_int_id)
    .then(data => {
        res.statusCode = 200;
        res.json({
            success: true,
            recommendation_session: data.sessionid
        });
    })
    .catch(err => {
        res.statusCode = 500;
        res.json({
            success: false,
            reason: err.message
        });
    });
});

module.exports = recommendation;