var amqp = require('amqplib/callback_api');

//var args = process.argv.slice(2);
var headerMap = new Map();
headerMap.set("1", "50.941357-6.958307");
headerMap.set("2", "51.941357-7.958307");

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'headers_logs';

    channel.assertExchange(exchange, 'headers', {
      durable: false
    });

    channel.assertQueue('Warning', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
      
      headerMap.forEach(function(value,key) {
        channel.bindQueue(q.queue, exchange, "headers", headerMap);
        console.log(key + "/" + value);
      },headerMap);

      channel.consume(q.queue, function(msg) {
        console.log("%s: %s bei Koordinaten?", msg.fields.routingKey, msg.content.toString() );
      }, {
        noAck: true
      });
    });
  });
});

//Properties einfügen, um header Infos lesen zu können
