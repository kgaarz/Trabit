const amqp = require('amqplib/callback_api');
const Directions = require('../models/Directions.js');
const Traffics = require('../models/Traffics');
require('dotenv/config');
const axios = require('axios');

//ToDo: jede 5 Minuten traffic in den directions überprüfen
//ToDo: abfrage in die Connection des Servers integrieren
//ToD0: postNewTraffic richtig aufrufen
//5 Minuten: 300000
var timer = setInterval(function(){getTrafficForDirections();}, 20000);
var traffic =[];
function getTrafficForDirections(){
var directions = getAllRoutes(Directions);
console.log(directions);
for(i =0; i<directions.length; i++){
  var temp = postNewTraffic(directions[i].id);
  traffic.push(temp);
  if(traffic.length != 0){
    console.log("geschafft");
  }
}


amqp.connect('amqp://localhost', (error0, connection)=> {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel)=> {
    if (error1) {
      throw error1;
    }
    var exchange = 'headers_logs';
    var msg = [];
    var rountingKey= "Warning";

    var headerOptions = new Map();
    var headerKey = "trafficCord";
    /*
    traffic.forEach(each=>{
      traffic[each].comprimisedTraffic.incidents.forEach(counter=>{
      headerOptions.set(traffic[each].directionID, traffic[each].comprimisedTraffic.incidents[counter].step);
      msg.push(traffic[each].id);
    });
  });
  }
    */
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
    channel.publish(exchange, rountingKey, Buffer.from(msg[i]), opts[i]);
    console.log("Sent Header:"+opts[i].headers.key+"; "+opts[i].headers.value+"-"+ opts[i].headers.value+ " and Message: " +msg[i]);
}
  });

  setTimeout(()=> {
    connection.close();
    process.exit(0)
  }, 10000);
});
}

function getAllRoutes(schema){
  schema.find({})
    .exec()
    .then(doc => {
      console.log("test1");
      if (doc) {
        console.log(doc);
        return doc;
      }else{
        console.log("error1");
        throw err;
      }
  })
  .catch(err => {
    console.log("error2");
    throw error;
    });
  }




function postNewTraffic (directionID) {
  Directions.findById(
      directionID
    )
    .exec()
    .then(doc => {
      if (doc) {
        var comprimisedTraffic = {
          "incidents": []
        };
        for (i = 0; i < doc.steps.length; i++) {
          var temp = comprimiseTraffic(doc, i, comprimisedTraffic);
          temp.then(function(result) {
            comprimisedTraffic = result;
          }, function(error) {
            throw error;
          });
        }
        setTimeout(function() {
          const traffic = new Traffics({
            traffic: comprimisedTraffic,
            directionID: directionID
          });
          traffic.save(function(error, result) {
            if (result) {
              return result;
            }
            if (error) {
              throw error
              }
          });
        }, 500);
      } else {
        throw error;
      }
    })
    .catch(err => {
      throw error;
      });
    }


async function comprimiseTraffic(doc, i, comprimisedTraffic) {
return new Promise(function(resolve, reject) {
  axios.get('https://traffic.api.here.com/traffic/6.0/incidents.json?corridor=' + doc.steps[i].start_location.lat + "," + doc.steps[i].start_location.lng + ';' + doc.steps[i].end_location.lat + "," + doc.steps[i].end_location.lng + ';' + "10" + '&app_id=' + process.env.HERE_APP_ID + '&app_code=' + process.env.HERE_APP_CODE)
    .then(response => {
      // Die Response komprimieren
      if (response.data.TRAFFICITEMS) {
        var trafficArray = response.data.TRAFFICITEMS.TRAFFICITEM;
        var redundant = false;
        for (j = 0; j < trafficArray.length; j++) {
          var object = {
            trafficitemid: trafficArray[j].TRAFFICITEMID,
            geolocation: {
              origin: {
                lat: trafficArray[j].LOCATION.GEOLOC.ORIGIN.LATITUDE,
                lng: trafficArray[j].LOCATION.GEOLOC.ORIGIN.LONGITUDE
              },
              destination: {
                lat: trafficArray[j].LOCATION.GEOLOC.TO[0].LATITUDE,
                lng: trafficArray[j].LOCATION.GEOLOC.TO[0].LONGITUDE
              }
            },
            trafficdescription: trafficArray[j].TRAFFICITEMDESCRIPTION[1].content,
            step: i
          };
          if (comprimisedTraffic.incidents.length == 0) {
            comprimisedTraffic.incidents.push(object);
          }
          for (k = 0; k < comprimisedTraffic.incidents.length; k++) {
            if (object.trafficitemid === comprimisedTraffic.incidents[k].trafficitemid) {
              redundant = true;
            }
            if (k == comprimisedTraffic.incidents.length - 1 && !redundant) {
              comprimisedTraffic.incidents.push(object);
            }
          }
        }
      }
      resolve(comprimisedTraffic);
    })
    .catch(error => {
      reject(error);
    });
});
}
