const axios = require('axios');
require('dotenv/config');

module.exports = {
  getFlinksterData: function(lat, lng, radius) {
    return new Promise(function(resolve, reject) {
      var flinksterItems = [];
      const providernetwork = "1";
      const mode = "car";

      axios.get('https://api.deutschebahn.com/flinkster-api-ng/v1/areas?lat=' + lat + '&lon=' + lng + '&radius=' + radius + '&providernetwork=' + providernetwork, {
          headers: {
            'Authorization': process.env.FLINKSTER_KEY
          }
        })
        .then(response => {
          for (i = 0; i < response.data.items.length; i++) {
            var object = {
              itemID: response.data.items[i].uid,
              geoLocation: {
                lat: response.data.items[i].geometry.position.coordinates[1],
                lng: response.data.items[i].geometry.position.coordinates[0],
              },
              description: {
                parking: response.data.items[i].attributes.parking,
                locationNote: response.data.items[i].attributes.locationnote
              },
              mode: mode
            }
            flinksterItems.push(object);
          }
          resolve(flinksterItems);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getCabData: function(lat, lng, radius) {
    return new Promise(function(resolve, reject) {
      var cabItems = [];
      const providernetwork = "2";

      const mode = "bike";

      axios.get('https://api.deutschebahn.com/flinkster-api-ng/v1/areas?lat=' + lat + '&lon=' + lng + '&radius=' + radius + '&providernetwork=' + providernetwork, {
          headers: {
            'Authorization': process.env.FLINKSTER_KEY
          }
        })
        .then(response => {
          for (i = 0; i < response.data.items.length; i++) {
            var geoLocation;
            if (response.data.items[i].geometry.position.type === "Point") {
              var object = {
                itemID: response.data.items[i].uid,
                geoLocation: {
                  lat: response.data.items[i].geometry.position.coordinates[1],
                  lng: response.data.items[i].geometry.position.coordinates[0],
                },
                mode: mode
              }
              cabItems.push(object);
            }
          }
          resolve(cabItems);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getHereData: function(lat, lng, radius) {
    return new Promise(function(resolve, reject) {
      var transitItems = [];
      const mode = "transit";

      axios.get('https://transit.api.here.com/v3/stations/by_geocoord.json?center=' + lat + '%2C' + lng + '&radius=' + radius + '&app_id=' + process.env.HERE_APP_ID + '&app_code=' + process.env.HERE_APP_CODE)
        .then(response => {

          for (i = 0; i < response.data.Res.Stations.Stn.length; i++) {
            var transports = [];
            for (j = 0; j < response.data.Res.Stations.Stn[i].Transports.Transport.length; j++) {
              var transportItem = {
                name: response.data.Res.Stations.Stn[i].Transports.Transport[j].name,
                direction: response.data.Res.Stations.Stn[i].Transports.Transport[j].dir
              }
              transports.push(transportItem);
            }


            var object = {
              itemID: response.data.Res.Stations.Stn[i].id,
              geoLocation: {
                lat: response.data.Res.Stations.Stn[i].y,
                lng: response.data.Res.Stations.Stn[i].x,
              },
              name: response.data.Res.Stations.Stn[i].name,
              distance: response.data.Res.Stations.Stn[i].distance,
              transports: transports,
              mode: mode
            }

            transitItems.push(object);
          }
          resolve(transitItems);

        })
        .catch(error => {
          reject(error);
        });
    });
  }

}
