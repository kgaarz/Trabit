var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'headers_logs';
    var args = process.argv.slice(2);
    var header = {ID: 1,LatLon: 34232};
    var msg = args.slice(1).join(' ') || 'Hello World!';
    var rountingKey= "";

    channel.assertExchange(exchange, 'headers', {
      durable: false
    });
    channel.publish(exchange, rountingKey, Buffer.from(msg), header);
    //for(let[key, value] of Object.entries(header)){
    console.log("Sent Header:"+header.ID+"; "+header.LatLon+ " and Message: " +msg);
  
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});



  