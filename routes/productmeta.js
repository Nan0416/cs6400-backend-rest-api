const express = require('express');
const metaRouter = express.Router();

const productMetaDBOp = require('../db_ops/productmeta');

function handler(res, next){
    return (err, result)=>{
        if(err != null){
            next(err);
        }else{
            res.status(200).json(result);
        }
    }
}


metaRouter.route("/departments")
.get((req, res, next)=>{
    productMetaDBOp.queryAllDepartments(handler(res, next));
})
metaRouter.route("/categories")
.get((req, res, next)=>{
    let department = req.query.department;
    if(department != null){
        productMetaDBOp.queryCategoriesByDepartment(department, handler(res, next));
    }else{
        productMetaDBOp.queryAllCategories(handler(res, next));
    }
})
module.exports = metaRouter;