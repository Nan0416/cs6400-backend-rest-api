

class RecommendationHandler{
    constructor(client){
        this.client = client;
        this.handlers = [];
    }
    sendRequest(userid, sessionid, product_asins){
        let data = {
            userid: userid,
            sessionid: sessionid,
            asins: product_asins
        };
        return this.client.send({body: JSON.stringify(data)});
    }

    setupHandler(handler, error_handler){
        return this.client.getPartitionIds()
        .then(ids => {
            for(let i = 0; i < ids.length; i++){
                let temp_handler = this.client.receive(ids[i], handler, error_handler);
                this.handlers.push(temp_handler);
                
            }
        })
    }
    stop(){
        let p = [];
        for(let i = 0; i < this.handlers.length; i++){
            p.push(this.handlers[i].stop());
        }
        return Promise.all(p);
    }
}

module.exports = RecommendationHandler;