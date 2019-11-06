const productDB = require('../db_models/product');

function queryAllDepartments(callback){
    productDB.distinct('department').lean().exec((err, departments) => {
        if(err != null){
            callback(err);
        }else{
            callback(null, departments == null? []: departments);
        }
    });
}
function queryCategoriesByDepartment(department, callback){
    productDB.distinct('category', {department: department}).lean().exec((err, categories) => {
        if(err != null){
            callback(err);
        }else{
            callback(null, categories == null? []: categories);
        }
    });
}
function queryAllCategories(callback){
    productDB.distinct('category').lean().exec((err, categories) => {
        if(err != null){
            callback(err);
        }else{
            callback(null, categories == null? []: categories);
        }
    });
}

module.exports.queryAllDepartments = queryAllDepartments;
module.exports.queryCategoriesByDepartment = queryCategoriesByDepartment;
module.exports.queryAllCategories = queryAllCategories;