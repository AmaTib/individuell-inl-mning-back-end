const { players } = require("./players");

//Ger ett id som inte någon annat objekt har
function generateUniqueId() {
  let m = Math.max(...players.map((player) => player.id));
  return m + 1;
}

module.exports = { generateUniqueId };
