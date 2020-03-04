const amqp = require('amqplib/callback_api');

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
    var headerKey = "trafficCord";
    var headerValue = {lat:"51.941357", lng: "7.958307"};
    var headerValue2 = {lat:"50.941357", lng: "6.958307"};
    headerOptions.set(headerKey, headerValue);
    headerOptions.set("headerKey", headerValue2);
    var opts = [];
    headerOptions.forEach((value,key)=> {
        let store = {'key': key, 'value': value};
        opts.push({headers:store});
      });
    console.log(opts.length);

    channel.assertExchange(exchange, 'headers', {
      durable: false
    });

    //let opts = [{headers: {'key': headerKey, 'value': headerValue}}, {headers:{'key': "test", 'value': headerValue2} }];
    for(i=0; i<opts.length; i++){
    channel.publish(exchange, rountingKey, Buffer.from(msg), opts[i]);
    console.log("Sent Header:"+opts[i].headers.key+"; "+opts[i].headers.value.lat+"-"+ opts[i].headers.value.lng+ " and Message: " +msg);
}
  });

  setTimeout(()=> {
    connection.close();
    process.exit(0)
  }, 10000);
});
