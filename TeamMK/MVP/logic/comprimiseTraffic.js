const axios = require('axios');
require('dotenv/config');

module.exports = async function comprimiseTraffic(doc, i, comprimisedTraffic) {
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
              trafficdescription: trafficArray[j].TRAFFICITEMDESCRIPTION[1].content
            };

            if (comprimisedTraffic.incidents.length == 0) {
              comprimisedTraffic.incidents.push(object);
            }

            // Prüfe ob der Incident bereits im Array eingetragen ist
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
