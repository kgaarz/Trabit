const getSortedRoutesHelper = require('./getSortedRoutesHelper');
//TODO: in alle Helper-Klassen integrieren

module.exports={

    checkNearRoutesForTwo: function (data, firstHelper, secondHelper, ownOption, origin, destination, departureTime) {
        return new Promise(function(resolve, reject) {
            var totalRoutes = [];
      
            totalRoutes.push(firstHelper(origin, destination, departureTime));
            totalRoutes.push(secondHelper(origin, destination, departureTime));
            for (i = 0; i < data.length; i++) {
              totalRoutes.push(ownOption(data, origin, destination, departureTime, i));
            };
      
            Promise.all(totalRoutes).then((values) => {
              var result = [];
              result.push(values[0][0]);
              result.push(values[0][1]);
              result.push(values[1][0]);
              result.push(values[1][1]);
              for (i = 2; i < values.length; i++) {
                result.push(values[i]);
              }
              resolve(getSortedRoutesHelper(result));
            })
          },
          (error) => {
            reject(error);
          });
      }
}