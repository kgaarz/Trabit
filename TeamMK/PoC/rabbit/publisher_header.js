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
    var msg = 'Verkehrsunfall auf A4';
    var rountingKey= "Warning";

    var headerMap = new Map();
    var headerKey = "1";
    var headerValue = "50.941357-6.958307";
    headerMap.set(headerKey, headerValue);

    channel.assertExchange(exchange, 'headers', {
      durable: false
    });
    channel.publish(exchange, rountingKey, Buffer.from(msg), headerMap);
    //for(let[key, value] of Object.entries(header)){
    console.log("Sent Header:"+headerKey+"; "+headerValue+ " and Message: " +msg);
  
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});



  