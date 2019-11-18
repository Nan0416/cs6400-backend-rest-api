const express = require('express');
const userRouter = express.Router();
const productMetaDBOp = require('../db_ops/productmeta');
/** a router for the recommendation engine */
userRouter.route("/total")
.get((req, res, next)=>{

});

/** query a list of user in order of their #review. */
userRouter.route("/")
.get((req, res, next)=>{

});

module.exports = userRouter;