module.exports = function(values) {
  var routes = []
  var shortestRoute = {};
  var secondShortestRoute = {};
  var tmp, tmpShortestRoute;
  var lowest = Number.POSITIVE_INFINITY;
  var secondLowest = Number.POSITIVE_INFINITY;
  if (values.length >= 2) {
    if (values[0].duration > values[1].duration) {
      lowest = values[1].duration;
      shortestRoute = values[1];
      secondLowest = values[0].duration;
      secondShortestRoute = values[0];
    } else {
      lowest = values[0].duration;
      shortestRoute = values[0];
      secondLowest = values[1].duration;
      secondShortestRoute = values[1];
    }
    for (var i = values.length - 1; i >= 0; i--) {
      if (values[i].duration < secondLowest) {
        if (lowest > values[i].duration) {
          tmp = lowest;
          lowest = values[i].duration;
          secondLowest = tmp;
          tmpShortestRoute = shortestRoute;
          shortestRoute = values[i];
          secondShortestRoute = tmpShortestRoute;
        }
        if (values[i].duration > lowest) {
          secondLowest = values[i].duration;
          secondShortestRoute = values[i];
        }
      }
    }
  }
  routes.push(shortestRoute);
  routes.push(secondShortestRoute);
  return routes;
}
