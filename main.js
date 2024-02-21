/* const { players } = require("./players");
const { generateUniqueId } = require("./idFunction"); */

/* const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");  //ta bort!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const rl = readline.createInterface({ input, output }); */
const { sequelize, Player } = require("./models");
const migrationhelper = require("./migrationhelper");
const { validatePlayer } = require("./validators/playerValidator");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

var bodyParser = require("body-parser"); //för att rest-client verktyget ska fungera...?
app.use(bodyParser.json());
app.use(cors());

//REQUESTS
//get all players (from database)
app.get("/players", async (req, res) => {
  let players = await Player.findAll();
  let result = players.map((player) => ({
    id: player.id,
    name: player.name,
    jersey: player.jersey,
    position: player.position,
  }));

  res.json(result);
  console.log(result);
});

//get players with specific id
/* app.get("/players/:id", (req, res) => {
  let onePlayer = players.find((player) => player.id === req.params.id);
  if (onePlayer === undefined) {
    res.status(404).send("Finns inte");
  }
  res.json(onePlayer);
  console.log(onePlayer);
}); */

//creates new player
app.post("/players", validatePlayer, async (req, res) => {
  const { name, jersey, position } = req.body;
  try {
    const thisPlayer = await Player.create({ name, jersey, position });
    return res.json(thisPlayer);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//update/edit player
//updatera - REPLACE HELA OBJEKTET
app.put("/players/:id", async (req, res) => {
  const playerId = req.params.id;
  const { name, jersey, position } = req.body;

  const thisPlayer = await Player.findOne({
    where: { id: playerId },
  });

  thisPlayer.name = name;
  thisPlayer.jersey = jersey;
  thisPlayer.position = position;

  await thisPlayer.save();

  return res.status(204).json({ err: "ok" });

  /*  let onePlayer = players.find((player) => player.id == req.params.id);
  if (onePlayer == undefined) {
    res.status(404).send("Finns inte");
  }
  onePlayer.name = req.body.name;
  onePlayer.jersey = req.body.jersey;
  onePlayer.position = req.body.position;
  onePlayer.id = req.body.id;
  res.status(204).send("Updated"); */
});

app.delete("/players/:id", async (req, res) => {
  const playerId = req.params.id;
  const thisPlayer = await Player.findOne({
    where: { id: playerId },
  });

  await thisPlayer.destroy();
  return res.json({ message: "Employee deleted!" });
});

app.listen(port, async () => {
  await migrationhelper.migrate();
  console.log(`Example app listening on port ${port}`);
});
