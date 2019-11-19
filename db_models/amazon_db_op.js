const bcrypt = require('bcrypt');

class AmazonDBOps{
    constructor(db){
        this.db = db;
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