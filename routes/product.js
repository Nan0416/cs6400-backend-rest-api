const express = require('express');
const productRouter = express.Router();
const productDBOp = require('../services/product');
function toInt(number){
    let t = parseInt(number);
    if(isNaN(t)){
        return null;
    }
    if(t.toString() == number){
        return t;
    }else{
        return null;
    }
}
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
    
    if(qry.page != null){
        let temp = toInt(qry.page);
        if(temp == null){
            return false;
        }else{
            qry.page = temp;
        }
    }
    if(qry.limit != null){
        let temp = toInt(qry.limit);
        if(temp == null){
            return false;
        }else{
            qry.limit = temp;
        }
    }
    if(qry.offset != null){
        let temp = toInt(qry.offset);
        if(temp == null){
            return false;
        }else{
            qry.offset = temp;
        }
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
        productDBOp.queryProductById(req.query.id, (err, product)=>{
            if(err != null){
                next(err);
            }else if(product == null){
                res.status(404).json({success: false, reasons: `cannot find ${req.query.id} product.`});
            }else{
                res.status(200).json(product);
            }
        });

    }else if(req.query.category != null){
        productDBOp.queryProductsByCategory(req.query.category, req.query, handler(res, next));
    }else if(req.query.deparment != null){
        productDBOp.queryProductsByDepartment(req.query.deparment, req.query, handler(res, next));
    }else{
        productDBOp.queryProducts(req.query, handler(res, next));
    }
});
module.exports = productRouter;