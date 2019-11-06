
const productDB = require('../db_models/product');

function queryProductById(id, callback){
    productDB.find({id: id}).lean().exec((err, departments) => {
        if(err != null){
            callback(err);
        }else if(departments == null || departments.length == 0){
            callback(null, null);
        }else{
            callback(null, departments[0]);
        }
    });
}
function queryProductsByCategory(category, option, callback){
    callback(new Error("not implemented !"));
}
function queryProductsByDepartment(department, option, callback){
    callback(new Error("not implemented !"));
}
function queryProducts(option, callback){
    callback(new Error("not implemented !"));
}

module.exports.queryProductById = queryProductById;
module.exports.queryProductsByCategory = queryProductsByCategory;
module.exports.queryProductsByDepartment = queryProductsByDepartment;
module.exports.queryProducts = queryProducts;