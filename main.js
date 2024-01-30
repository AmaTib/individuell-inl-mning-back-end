const { players } = require("./players");
const { generateUniqueId } = require("./idFunction");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

var bodyParser = require("body-parser"); //för att rest-client verktyget ska fungera...?
app.use(bodyParser.json());
app.use(cors());

//REQUESTS
//get all players
app.get("/players", (req, res) => {
  res.json(players);
  console.log(players);
});

//get players with specific id
app.get("/players/:id", (req, res) => {
  let onePlayer = players.find((player) => player.id === req.params.id);
  if (onePlayer === undefined) {
    res.status(404).send("Finns inte");
  }
  res.json(onePlayer);
  console.log(onePlayer);
});

//creates new player and pushes to "players" array
app.post("/players", (req, res) => {
  const player = {
    name: req.body.name,
    jersey: req.body.jersey,
    position: req.body.position,
    id: generateUniqueId(),
  };
  players.push(player);
  res.status(201).send("Created");
  console.log(players);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
