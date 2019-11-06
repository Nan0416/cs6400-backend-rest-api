const productDB = require('../db_models/product');

function queryAllDepartments(callback){
    productDB.find({}, {}, {limit:20}).lean().exec((err, departments) => {
        console.log(err);
        console.log(departments);
        callback(new Error("not implemented !"));
    });
}
function queryCategoriesByDepartment(department, callback){
    callback(new Error("not implemented !"));
}
function queryAllCategories(callback){
    callback(new Error("not implemented !"));
}

module.exports.queryAllDepartments = queryAllDepartments;
module.exports.queryCategoriesByDepartment = queryCategoriesByDepartment;
module.exports.queryAllCategories = queryAllCategories;