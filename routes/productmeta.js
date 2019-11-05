const express = require('express');
const metaRouter = express.Router();

const productMetaDBOp = require('../services/productmeta');

function handler(res, next){
    return (err, result)=>{
        if(err != null){
            next(err);
        }else{
            res.status(200).json(result);
        }
    }
}


metaRouter.route("/department")
.get((req, res, next)=>{
    productMetaDBOp.queryAllDepartments(handler(res, next));
})
metaRouter.route("/category")
.get((req, res, next)=>{
    let department = req.query.department;
    if(department != null){
        productMetaDBOp.queryCategoriesByDepartment(department, handler(res, next));
    }else{
        productMetaDBOp.queryAllCategories(handler(res, next));
    }
})
module.exports = metaRouter;