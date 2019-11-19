const bcrypt = require('bcrypt');

class AmazonDBOps{
    constructor(db){
        this.db = db;
    }

    queryProductById(product_asin){
        return this.db.product.findOne({
            where:{
                asin: product_asin
            }
        })
        .then(product_ =>{
            return new Promise((resolve, reject) => {
                if(product_ == null){
                    reject(new Error("not found"));
                }else{
                    resolve(product_.dataValues);
                }
            });
        })
        .then(product => {
            return this.queryImagesByProductId(product.asin)
            .then(image_urls => {
                product.image_urls = image_urls;
                return new Promise((resolve, reject)=>{
                    resolve(product);
                })
            })
        })
        .then(product => {
            return this.queryProductCategoriesById(product.asin)
            .then(categories => {
                product.categories = categories;
                return new Promise((resolve, reject)=>{
                    resolve(product);
                });
            });
        })
    }
    queryImagesByProductId(product_asin){
        return this.db.image.findAll({
            where:{
                product_asin: product_asin
            }
        })
        .then(images_ => {
            return new Promise((resolve, reject) => {
                let image_urls = [];
                for(let i = 0; i < images_.length; i++){
                    image_urls.push(images_[i].dataValues.url);
                }
                resolve(image_urls);
            });
        });
    }

    queryProductCategoriesById(product_asin){
        return this.db.pc_mapping.findAll({
            where:{
                product_asin: product_asin
            }
        })
        .then(c_mapping => {
            let pro = [];
            for(let i = 0; i < c_mapping.length; i++){
                pro.push(this.db.category.findOne({
                    where:{
                        id: c_mapping[i].dataValues.category_id
                    }
                }));
            }
            return Promise.all(pro).then((values) => {
                let category_names = [];
                for(let i = 0; i < values.length ;i++){
                    category_names.push(values[i].dataValues.name);
                }
                return Promise.resolve(category_names);
            });
        })
    }
   

    queryReviewByReviewerId(reviewerId, offset, limit, fields = ["review_id", "product_asin", "rating"]){
        return this.db.review2.findAll({
            attributes: fields,
            where:{
                review_id: reviewerId
            },
            offset: offset, 
            limit: limit
        })
        .then(reviews =>{
            let reviews_ = [];
            for(let i = 0; i < reviews.length; i++){
                reviews_.push({
                    reviewer_id: reviews[i].dataValues.review_id,
                    product_asin: reviews[i].dataValues.product_asin,
                    rating: reviews[i].dataValues.rating
                });
            }
            return new Promise((resolve, reject)=>{
                resolve(reviews_);
            });
        });
    }
    queryReview(offset, limit, fields = ["review_id", "product_asin", "rating"]){
        return this.db.review2.findAll({
            attributes: fields,
            offset: offset, 
            limit: limit
        })
        .then(reviews =>{
            let reviews_ = [];
            for(let i = 0; i < reviews.length; i++){
                reviews_.push({
                    reviewer_id: reviews[i].dataValues.review_id,
                    product_asin: reviews[i].dataValues.product_asin,
                    rating: reviews[i].dataValues.rating
                });
            }
            return new Promise((resolve, reject)=>{
                resolve(reviews_);
            });
        });
    }

    queryUserById(id, fields = ['id', 'username']){
        return this.db.user2.findOne({
            attributes: fields,
            where:{
                id: id
            }   
        })
        .then(user =>{
            return new Promise((resolve, reject)=>{
                if(user == null){
                    reject(new Error("nodata"));
                }else{
                    resolve(user.dataValues);
                }
            });
        });
    }

    signupUser(id, username, password){
        return this.queryUserById(id)
        .then(_ => {
            /* user exsited */
            return new Promise((resolve, reject)=>{
                reject(new Error("user existed."));
            });
        })
        .catch(err =>{
            return new Promise((resolve, reject)=>{
                if(err.message != "nodata"){
                    reject(err);
                }else{
                    bcrypt.hash(password, 10, (err, hash_password) => {
                        if(err != null){
                            reject(err);
                        }else{
                            resolve(hash_password);
                        }
                    });
                }
            });
        })
        .then(hash_password =>{
            return this.db.user2.build({id: id, username: username, hash_password: hash_password}).save()
            .then(item =>{
                return new Promise((resolve, reject)=>{
                    resolve({id: item.dataValues.id, username: item.dataValues.username});
                });
            })
            .catch(err => {
                return new Promise((resolve, reject) =>{
                    reject(err);
                });
            });
        });
    }
}

module.exports = {
    AmazonDBOps: AmazonDBOps
}