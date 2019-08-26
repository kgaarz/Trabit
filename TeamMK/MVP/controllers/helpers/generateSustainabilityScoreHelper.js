module.exports = function(steps) {
  var sustainabilityScore = 0;
  for(i = 0; i < steps.length; i++) {
    sustainabilityScore += getScoreByMode(steps[i].mode, steps[i].distance);
  }
  return sustainabilityScore;
}

function getScoreByMode(mode, distance) {
  if(mode === "WALKING") return distance/1000 * 0;
  if(mode === "BICYCLING") return distance/1000 * 0;
  if(mode === "TRANSIT") return distance/1000 * 71;
  if(mode === "DRIVING") return distance/1000 * 142;
}
