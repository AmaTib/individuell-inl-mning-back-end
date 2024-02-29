/* const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");  //ta bort!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const rl = readline.createInterface({ input, output }); */

const { sequelize, Player } = require("./models");
const migrationhelper = require("./migrationhelper");
const { validatePlayer } = require("./validators/playerValidator");
const {
  getAllPlayers,
  createPlayer,
  editPlayer,
} = require("./controllers/playerController");

const { check } = require("express-validator");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//REQUESTS START----------------------------------------------------------
//get all players
app.get("/players", getAllPlayers);

//creates new player
app.post("/players", check("q").escape(), validatePlayer, createPlayer);

//update/edit player
app.put("/players/:id", validatePlayer, editPlayer);

//delete player
app.delete("/players/:id", async (req, res) => {
  const playerId = req.params.id;
  const thisPlayer = await Player.findOne({
    where: { id: playerId },
  });

  await thisPlayer.destroy();
  return res.json({ message: "Player deleted!" });
});
//REQUESTS END------------------------------------------------------------

app.listen(port, async () => {
  await migrationhelper.migrate();
  console.log(`Example app listening on port ${port}`);
});
