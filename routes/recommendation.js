const express = require('express');
const recommendation = express.Router();
const cors = require('../middlware/cors');

recommendation.route("/")
.get(cors.cors_allow_whitelist, (req, res, next)=>{
    if(req.query.asin == null || req.query.userid == null){
        res.statusCode = 400;
        res.json({
            success: false,
            reason:"bad query request."
        });
        return;
    }

    res.statusCode = 400;
    res.json({
        success: false,
        reason: "recommendation not implemented"
    });
});

module.exports = recommendation;