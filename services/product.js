
function queryProductById(id, callback){
    callback(new Error("not implemented !"));
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