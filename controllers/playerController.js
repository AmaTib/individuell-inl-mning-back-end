const { sequelize, Player } = require("../models");
const { Op } = require("sequelize");

async function getAllPlayers(req, res) {
  const sortCol = req.query.sortCol || "id"; //för att sortera
  const sortOrder = req.query.sortOrder || "asc"; //för att sortera

  const q = req.query.q || ""; //för att söka

  const players = await Player.findAll({
    where: {
      name: {
        [Op.like]: "%" + q + "%",
      },
    },
    order: [[sortCol, sortOrder]],
  });

  let result = players.map((player) => ({
    id: player.id,
    name: player.name,
    jersey: player.jersey,
    position: player.position,
  }));

  res.json(result);
  console.log(result);
}

async function createPlayer(req, res) {
  const { name, jersey, position } = req.body;
  try {
    const thisPlayer = await Player.create({ name, jersey, position });
    return res.json(thisPlayer);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

async function editPlayer(req, res) {
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
}

module.exports = {
  createPlayer,
  editPlayer,
  getAllPlayers,
};
