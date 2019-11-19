const express = require('express');
const review = express.Router();
const to_non_negative = require('../utilities/utilities').to_non_negative;
const dbOp = require('../db_models/amazon_db_instance').dbOp;

/** query reviews for a user */
review.route("/")
.get((req, res, next)=>{
    let limit = to_non_negative(req.query.limit);
    let offset = to_non_negative(req.query.offset);
    if(limit == null || offset == null){
        res.statusCode = 400;
        res.json({
            success: false,
            reason: "invalid query parameters",
        });
        return;
    }
    dbOp.queryReview(offset, limit)
    // dbOp.queryReviewByReviewerId("A3U7OGHNTGAXZK", offset, limit)
    .then(reviews => {
        res.statusCode = 200;
        res.json({
            success: true, 
            reviews: reviews
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
review.route("/metadata")
.get((req, res, next)=>{
    res.statusCode = 200;
    res.json({success: true, data:{
        total: 42002
    }});
});
module.exports = review;