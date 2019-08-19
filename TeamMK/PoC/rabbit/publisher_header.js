var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (error0, connection)=> {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel)=> {
    if (error1) {
      throw error1;
    }
    var exchange = 'headers_logs';
    var msg = 'Verkehrsunfall auf A4';
    var rountingKey= "Warning";

    var headerOptions = new Map();
    var headerKey = "2";
    var headerValue = {lat:"51.941357", lng: "7.958307"}
    headerOptions.set(headerKey, headerValue);
  
    channel.assertExchange(exchange, 'headers', {
      durable: false
    });

    let opts = {headers: { 'key': headerKey, 'value': headerValue}};
    channel.publish(exchange, rountingKey, Buffer.from(msg), opts);
    console.log("Sent Header:"+headerKey+"; "+headerValue.lat+"-"+ headerValue.lng+ " and Message: " +msg);

  });

  setTimeout(()=> { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});



  