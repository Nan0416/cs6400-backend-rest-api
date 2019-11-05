const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Product = new Schema({
    url: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    id: {
        type:String, 
        required: true
    },
    name:{
        type:String, 
        required: true
    },
    price:{
        type: Number,
        required: true,
    },
    brand:{
        type: String,
        default: "unknown"
    },
    review_num:{
        type: Number,
        default:0,
    },
    rating:{
        type: Number,
        default:0,
    },
    image_urls:[
        {
            type:String,
        }
    ]
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,
    usePushEach:true
});

Product.index({id: 1});
const product = mongoose.model("walmart_products", Product);
module.exports = product;