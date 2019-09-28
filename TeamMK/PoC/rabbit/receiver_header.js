
const amqp = require('amqplib/callback_api');


var location = {lat:"50.941357", lng: "6.958307"};
var location2 = {lat:"51.941357", lng: "7.958307"};

//INFO: unterschiedliche Keys erforderlich
/*headerOptions= new Map();
headerOptions.set("test", location);
headerOptions.set('5d52cd66dc2ad17bd5153a94', '1');
headerOptions.set("x-match", "any");*/



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

    /*  headerOptions.forEach((value,key)=> {
        let opts = {'key': key, 'value': value};*/
        var id = JSON.stringify('5d5421162d00f3971b6b6365');
        var step = JSON.stringify(1);
        var key =[id, 'x-match'];
        var value=[step, 'any'];
        for(i =0; i< key.length; i++){
        opts={'key': key[i], 'value': value[i]};
        channel.bindQueue(q.queue, exchange, '',opts);
        //console.log("Key: "+key + " ValueLat: " + value.lat+" ValueLng: "+value.lng );
      }
    //  },headerOptions);

      channel.consume(q.queue, (msg) => {
        //console.log("%s: %s bei: %s/%s", msg.fields.routingKey, msg.content.toString(), msg.properties.headers.value.lat,msg.properties.headers.value.lng );
        console.log(msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});
