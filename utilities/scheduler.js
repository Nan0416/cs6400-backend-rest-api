
const EventEmitter = require("events");
class ParallelScheduler{
    constructor(max_task, times, task){
        this.evt = new EventEmitter();
        this.max_task = max_task;
        this.task_id = 0;
        this.times =  times;
        this.evt.on('next', ()=>{
            let current_id = this.task_id;
            this.task_id += 1;
            task(current_id, (err)=>{
                if(err){
                    console.log(err.message);
                }
                if(this.times == this.task_id){
                    return;
                }else{
                    this.evt.emit('next');
                }
            });
        });
    }
    
    start(){
        for(let i = 0; i < this.max_task; i++){
            this.evt.emit('next');
        }
    }
}

module.exports = ParallelScheduler;