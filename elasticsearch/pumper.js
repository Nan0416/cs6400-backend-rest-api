const { Client } = require('@elastic/elasticsearch');
const ProductSearch = require('./ProductSearch');
const ParallelScheduler = require('../utilities/scheduler');

const es_config = require('../config').elasticsearch_config;
const client = new Client({node: es_config.domain});

const productSearch = new ProductSearch(client);
const dbOp = require('../db_models/amazon_db_instance').dbOp;

const indexed_products = new Set();
function index_product(product_asin, callback){
    if(indexed_products.has(product_asin)){
        callback(null, {asin: product_asin});
        return;
    }
    indexed_products.add(product_asin);
    dbOp.queryProductById(product_asin)
    .then(product => {
        let required_fields = ["title","brand","main_cat","description", "image_urls", "categories"];
        let obj = {};
        for(let i = 0; i < required_fields.length; i++){
            if(product[required_fields[i]] != null){
                obj[required_fields[i]] = product[required_fields[i]];
            }
        }
        return productSearch.indexProduct(product.asin, obj)
    })
    .then(v =>{
        callback(null, v);
    })
    .catch(err => {
        callback(err);
    })
}
// index_product('B000097O5F');

dbOp.queryReview(0, 659829)
.then(reviews => {
    console.log(reviews.length);
    const p = new ParallelScheduler(10,  reviews.length, (id, callback)=>{
        index_product(reviews[id].product_asin, (err, value)=>{
            console.log(`Done ${id}. ${reviews[id].product_asin}`);
            if(err){
                callback(err);
            }else{
                callback();
            }
        })
    });
    p.start();
});