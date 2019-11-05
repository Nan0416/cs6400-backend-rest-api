const express = require('express');
const productRouter = express.Router();
const productDBOp = require('../services/product');

function verifyQuery(qry){
    // only id.
    if(qry.id != null && qry.department == null && qry.category == null && 
        qry.offset == null && qry.limit == null && qry.page == null){
        return true;
    }
    // not both department and category.
    if(qry.department != null && qry.category != null){
        return false;
    }
    if(qry.page != null && (qry.limit != null || qry.offset != null)){
        return false;
    }
    return true;
}

function handler(res, next){
    return (err, result)=>{
        if(err != null){
            next(err);
        }else{
            res.status(200).json(result);
        }
    }
}

productRouter.route("/")
.get((req, res, next)=>{
    if(!verifyQuery(req.query)){
        res.statusCode = 400;
        res.json({
            success: false,
            reasons: "bad request parameters. please check valid endpoints.",
        });
        return;
    }
    
    if(req.query.id != null){
        productDBOp.queryProductById(req.query.id, handler(res, next));

    }else if(req.query.category != null){
        productDBOp.queryProductsByCategory(req.query.category, req.query, handler(res, next));
    }else if(req.query.deparment != null){
        productDBOp.queryProductsByDepartment(req.query.deparment, req.query, handler(res, next));
    }else{
        productDBOp.queryProducts(req.query, handler(res, next));
    }
});
module.exports = productRouter;