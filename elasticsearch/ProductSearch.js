
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

    queryProductByIds(ids){
        return this.client.search({
            index: this.index_name,
            _source: true,
            body:{
                "query": {
                    "ids" : {
                        "values" : ids
                    }
                }
            }
        });
    }
    queryProductById(id){
        return this.client.search({
            index: this.index_name,
            _source: true,
            body:{
                "query": {
                    "ids" : {
                        "values" : [id]
                    }
                }
            }
        });
    }
    searchProduct(search_text, limit = 0, offset = 0){
        return this.client.search({
            index: this.index_name,
            from: offset,
            size: limit,
            _source: true,
            body:{
                "query":{
                    "dis_max":{
                        "queries": [
                            {
                                "match":{
                                    "description":{
                                        "query": search_text,
                                        "operator":"or",
                                        "minimum_should_match":"50%"
                                    }
                                }
                            },
                            {
                                "match":{
                                    "title":{
                                        "query": search_text,
                                        "operator":"or",
                                        "minimum_should_match":"90%"
                                    }
                                }
                            },
                            {
                                "match":{
                                    "main_cat":{
                                        "query": search_text,
                                        "operator":"or",
                                        "minimum_should_match":1
                                    }
                                }
                            },
                            {
                                "match":{
                                    "brand":{
                                        "query": search_text,
                                        "operator":"or",
                                        "minimum_should_match":1
                                    }
                                }
                            },
                            {
                                "match":{
                                    "categories":{
                                        "query": search_text,
                                        "operator":"or",
                                        "minimum_should_match":1
                                    }
                                }   
                            }
                        ],
                        "tie_breaker":0.9
                    }
                }
            }
        })
    }
}

module.exports = ProductSearch;