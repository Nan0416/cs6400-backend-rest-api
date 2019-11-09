
const productDB = require('../db_models/product');

const max_limit = 50;
const regular_limit = 20;
const page_size = regular_limit;
function getOption(option){
    option_ = {sort: {_id:1}};
    if(option.limit != null){
        if(option.limit == 0){
            option.limit = regular_limit;
        }else if(option.limit > max_limit){
            option.limit = max_limit;
        }
        if(option.offset == null){
            option.offset = 0;
        }
        option_['limit'] = option.limit;
        option_['skip'] = option.offset;
    }else if(option.page != null && option.page >= 1){
        option_['skip'] = (option.page - 1) * page_size;
        option_['limit'] = page_size;
    }else if(option.offset != null){
        option_['skip'] = option.offset;
        option_['limit'] = regular_limit;
    }else{
        option_['skip'] = 0;
        option_['limit'] = page_size;
    }
    return option_;
}

function queryProductById(id, callback){
    productDB.findOne({id: id}).lean().exec((err, department) => {
        if(err != null){
            callback(err);
        }else if(department == null){
            callback(null, null);
        }else{
            callback(null, department);
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