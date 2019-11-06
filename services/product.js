
const productDB = require('../db_models/product');

const max_limit = 50;
const regular_limit = 20;
const page_size = regular_limit;
function getOption(option){
    option_ = {sort: {_id:1}};
    if(option.limit != null){
        option.limit = 
        option_['limit'] = option.limit > max_limit? max_limit: option.limit;
        option_['skip'] = option.offset == null? 0: option.offset;
    }else if(option.page != null){
        option_['skip'] = (option.page - 1) * page_size;
        option_['limit'] = page_size;
    }else{
        option_['skip'] = 0;
        option_['limit'] = page_size;
    }
    return option_;
}
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
    option_ = getOption(option);
    console.log(option_)
    productDB.find({category: category}, null, option_).lean().exec((err, products) => {
        if(err != null){
            callback(err);
        }else{
            callback(null, products);
        }
    });
}
function queryProductsByDepartment(department, option, callback){
    option_ = getOption(option);
    console.log(option_)
    productDB.find({department: department}, null, option_).lean().exec((err, products) => {
        if(err != null){
            callback(err);
        }else{
            callback(null, products);
        }
    });
}
function queryProducts(option, callback){
    option_ = getOption(option);
    console.log(option_)
    productDB.find({}, null, option_).lean().exec((err, products) => {
        if(err != null){
            callback(err);
        }else{
            callback(null, products);
        }
    });
}

module.exports.queryProductById = queryProductById;
module.exports.queryProductsByCategory = queryProductsByCategory;
module.exports.queryProductsByDepartment = queryProductsByDepartment;
module.exports.queryProducts = queryProducts;