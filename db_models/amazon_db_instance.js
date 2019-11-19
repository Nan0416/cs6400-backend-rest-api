const AmazonProductDB = require('./amazon_db').AmazonProductDB;
const AmazonDBOps  = require('./amazon_db_op').AmazonDBOps;
const connection_string = require('../config').db_config.connection_string;
module.exports.dbOp = new AmazonDBOps(new AmazonProductDB(connection_string));




/*dbOp.queryUserByUsername("Pranshu")
.then(user=>{
    console.log(user)
    return dbOp.queryReviewByUserId(user.id);
})
.then(reviews=>{
    console.log(reviews);
})
.catch(err => {
    console.log(err.message);
})*/
/*dbOp.signupUser("qinnan2", "1234")
.then(x => {
    console.log(x);
})
.catch(err => {
    console.log(err.message);
})*/