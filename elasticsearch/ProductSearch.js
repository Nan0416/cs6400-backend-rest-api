
class ProductSearch{
    constructor(client, index_name = "product-index"){
        this.client = client;
        this.index_name = index_name;
    }
    indexProduct(asin, product){
        return this.client.index({
            id: asin,
            index: this.index_name,
            body: product
        })
        .then(v => {
            return Promise.resolve({asin: asin, response: v});
        })
    }
    searchProduct(search_text){

    }
}

module.exports = ProductSearch;