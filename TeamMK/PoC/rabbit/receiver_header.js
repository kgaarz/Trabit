var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: Test für header Exchange");
  process.exit(1);
}

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

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
      var keyValueHeader = [];
      for(i=2; i+1 < args.length;i+2){
          keyValueHeader.push({key:args[i].toString,value:args[i+1].toString});
      }
      
      keyValueHeader.forEach(function(header) {
        channel.bindQueue(q.queue, exchange, header);
      });

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});


/* public static String EXCHANGE_NAME = "header-exchange";
public static String QUEUE_NAME_1 = "header-queue-1";
public static String QUEUE_NAME_2 = "header-queue-2";
public static String QUEUE_NAME_3 = "header-queue-3";
 
public static String ROUTING_KEY = "";
 
public void createExchangeAndQueue(){
  Map<String,Object> map = null; 
  try{
     Connection conn = RabbitMQConnection.getConnection();
     if(conn != null){
       Channel channel = conn.createChannel(); 
 
       channel.exchangeDeclare(EXCHANGE_NAME, ExchangeType.HEADER.getExchangeName(), true);
       // First Queue 
       map = new HashMap<String,Object>();   
       map.put("x-match","any");
       map.put("First","A");
       map.put("Fourth","D");
       channel.queueDeclare(QUEUE_NAME_1, true, false, false, null);
       channel.queueBind(QUEUE_NAME_1, EXCHANGE_NAME, ROUTING_KEY ,map);

       


         // Consumer reading from queue 2 
         Consumer consumer2 = new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
              String message = new String(body, "UTF-8");
              System.out.println(" Message Received Queue 2 '" + message + "'");
            }
         };
         channel.basicConsume(HeaderExchange.QUEUE_NAME_2, true, consumer2); */