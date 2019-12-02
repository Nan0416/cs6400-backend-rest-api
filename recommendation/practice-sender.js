const { EventHubClient,delay } = require("@azure/event-hubs");

// Connection string - primary key of the Event Hubs namespace. 
// For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// const connectionString = "Endpoint=sb://<EVENT HUBS NAMESPACE NAME>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SHARED ACCESS KEY>";
const connectionString = "Endpoint=sb://nqin-practice.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=KtcT7lcwUNKxsaBpMcCV5ZieqbCvHOAH4tWv+ovzAFo=";
// Name of the event hub. For example: myeventhub
const eventHubsName = "first";

async function send() {
  const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);

  for (let i = 0; i < 10; i++) {
    const eventData = {body: `New event ${i}`};
    console.log(`Sending message: ${eventData.body}`);
    await client.send(eventData);
  }
  await client.close();
}

send().catch(err => {
  console.log("Error occurred: ", err);
});