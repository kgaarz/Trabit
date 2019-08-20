const DirectionsSelection = require('../models/DirectionsSelections');
const Directions = require('../models/Directions');

module.exports = {
  postNewDirection: function(userID, directionSelectionID, req, res) {
    const selection = req.body.selection;
    DirectionsSelection.findById(
        req.params.directionSelectionID
      )
      .exec()
      .then(doc => {
        if (doc) {
          var selectedRoute = doc.selections[selection];
          const directions = new Directions({
            userID: req.params.userID,
            distance: selectedRoute.distance,
            duration: selectedRoute.duration,
            startLocation: {
              lat: selectedRoute.route.startLocation.lat,
              lng: selectedRoute.route.startLocation.lng
            },
            endLocation: {
              lat: selectedRoute.route.endLocation.lat,
              lng: selectedRoute.route.endLocation.lng
            },
            steps: selectedRoute.route.steps
          })

          directions.save(function(error, result) {
            if (result) {
              res.status(200).send(result.id);
            }
            if (error) {
              res.status(502).json({
                message: "Database-Connection failed",
                error: error
              });
            }
          });
        }
      });
  },

  updateDirections: function(directionID, alternativeDirectionID, req, res) {
    // TODO: Muss noch gemacht werden
  }
}
