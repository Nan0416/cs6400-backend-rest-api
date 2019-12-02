const { EventHubClient,delay } = require("@azure/event-hubs");
const RecommendationHandler = require('./RecommendationHandler');
// Connection string - primary key of the Event Hubs namespace. 
// For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// const connectionString = "Endpoint=sb://<EVENT HUBS NAMESPACE NAME>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SHARED ACCESS KEY>";
const connectionString = "Endpoint=sb://nqin-practice.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=KtcT7lcwUNKxsaBpMcCV5ZieqbCvHOAH4tWv+ovzAFo=";
// Name of the event hub. For example: myeventhub
const eventHubsName = "first";

const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);
const rh = new RecommendationHandler(client);

rh.setupHandler((eventData)=>{console.log(eventData.body)}, console.log);



/*async function receive() {
    
    const allPartitionIds = await client.getPartitionIds();
    const firstPartitionId = allPartitionIds[0];
  
    const receiveHandler = client.receive(firstPartitionId, eventData => {
      console.log(`
      Received message: ${eventData.body}
      
      from partition ${firstPartitionId}`);
    }, error => {
      console.log('Error when receiving message: ', error)
    });


  
    // Sleep for a while before stopping the receive operation.
  }
  
  receive().catch(err => {
    console.log("Error occurred: ", err);
  });*/