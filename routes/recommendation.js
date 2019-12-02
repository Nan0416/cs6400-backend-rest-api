const express = require('express');
const recommendation = express.Router();
const cors = require('../middlware/cors');
const { EventHubClient} = require("@azure/event-hubs");
const event_hub_config = require('../config').eventHub;
console.log(event_hub_config);
const event_hub_client = EventHubClient.createFromConnectionString(event_hub_config.connection_string, event_hub_config.eventhub_name);
const RecommendationHandler = require('../recommendation/RecommendationHandler');
const recommendation_handler = new RecommendationHandler(event_hub_client);
const product_asin_to_int = require('../utilities/product_asin_to_int').product_asin_to_int;

let user_str_to_num = new Map();
let user_num_to_str = new Map();
const user_num_id_base = 700000;
let user_id_count = 0;

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
    res.statusCode = 200;
    res.json({
        success: true,
        include_data: false,
        products: []
    });
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
    
    user_id_count += 1;
    let user_num_id = user_num_id_base + user_id_count;
    user_str_to_num.set(req.query.userid, user_num_id);
    user_num_to_str.set(user_num_id, req.query.userid);

    let session_id = getRandomInt(10000000).toString();

    recommendation_handler.sendRequest(user_num_id, session_id, product_int_id)
    .then(data => {
        res.statusCode = 200;
        res.json({
            success: true,
            recommendation_session: session_id
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