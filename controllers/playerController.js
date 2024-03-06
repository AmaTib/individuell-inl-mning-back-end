const { sequelize, Player } = require("../models");
const { Op } = require("sequelize");

async function getAllPlayers(req, res) {
  const sortCol = req.query.sortCol || "id"; //för att sortera
  const sortOrder = req.query.sortOrder || "asc"; //för att sortera
  const offset = Number(req.query.offset || 0); //för att skapa sidor
  const limit = Number(req.query.limit || 5); //för att skapa sidor
  const q = req.query.q || ""; //för att söka

  const players = await Player.findAndCountAll({
    where: {
      /* name: {
        [Op.like]: "%" + q + "%",
      }, */
      [Op.or]: {
        name: { [Op.like]: "%" + q + "%" },
        jersey: { [Op.like]: "%" + q + "%" },
        position: { [Op.like]: "%" + q + "%" },
      },
    },
    order: [[sortCol, sortOrder]],

    offset: offset,
    limit: limit,
  });

  const total = players.count;

  const result = players.rows.map((player) => ({
    id: player.id,
    name: player.name,
    jersey: player.jersey,
    position: player.position,
  }));

  console.log(result);

  return res.json({
    total,
    result,
  });
}

async function createPlayer(req, res) {
  const { name, jersey, position } = req.body;
  try {
    const thisPlayer = await Player.create({ name, jersey, position });
    return res.json(thisPlayer);
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function editPlayer(req, res) {
  const playerId = req.params.id;
  const { name, jersey, position } = req.body;

  try {
    const thisPlayer = await Player.findOne({
      where: { id: playerId },
    });

    thisPlayer.name = name;
    thisPlayer.jersey = jersey;
    thisPlayer.position = position;

    await thisPlayer.save();
  } catch (err) {
    return res.status(204).json({ err: "ok" });
  }
}

module.exports = {
  createPlayer,
  editPlayer,
  getAllPlayers,
};
