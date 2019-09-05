module.exports = function(values) {
  var stepModes = []
  var switches = 0;

  for(r = 0; r < values.length; r++){
    stepModes.push(values[r].mode.toUpperCase());
  }

  var tempMode = stepModes[0];
  for(s = 0; s < stepModes.length; s++){
    if(stepModes[s] != tempMode || stepModes[s] == "TRANSIT" && stepModes[s] == "WALKING"){
      console.log(stepModes[s]);
      switches++;
    }
    tempMode = stepModes[s];
  }

  return switches;
}
