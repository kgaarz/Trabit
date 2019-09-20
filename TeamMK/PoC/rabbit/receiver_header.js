
const amqp = require('amqplib/callback_api');

var headerOptions = new Map();
var location = {lat:"50.941357", lng: "6.958307"};
var location2 = {lat:"51.941357", lng: "7.958307"};

//INFO: unterschiedliche Keys erforderlich
headerOptions.set("trafficCord2", location);
headerOptions.set("trafficCord", location2);
headerOptions.set("x-match", "any");
console.log(headerOptions);

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    var exchange = 'headers_logs';

    channel.assertExchange(exchange, 'headers', {
      durable: false
    });

    channel.assertQueue('', {
      durable: true,
      exclusive: false
    }, (error2, q) =>{
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      headerOptions.forEach((value,key)=> {
        let opts = {'key': key, 'value': value};
        channel.bindQueue(q.queue, exchange, '', opts);
        console.log("Key: "+key + " ValueLat: " + value.lat+" ValueLng: "+value.lng );
      },headerOptions);

      channel.consume(q.queue, (msg) => {
        console.log("%s: %s bei: %s/%s", msg.fields.routingKey, msg.content.toString(), msg.properties.headers.value.lat,msg.properties.headers.value.lng );
      }, {
        noAck: true
      });
    });
  });
});
