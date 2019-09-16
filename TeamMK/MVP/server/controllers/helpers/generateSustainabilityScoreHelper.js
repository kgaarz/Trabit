module.exports = function(steps) {
  var sustainabilityScore = 0;
  for(y = 0; y < steps.length; y++) {
    sustainabilityScore += getScoreByMode(steps[y].mode, steps[y].distance);
  }
  return sustainabilityScore;
}

function getScoreByMode(mode, distance) {
  if(mode === "WALKING") return distance/1000 * 0;
  if(mode === "BICYCLING") return distance/1000 * 0;
  if(mode === "TRANSIT") return distance/1000 * 71;
  if(mode === "DRIVING") return distance/1000 * 142;
}
