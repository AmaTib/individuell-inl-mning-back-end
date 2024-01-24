const { players } = require("./players");

const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

app.get("/players", (req, res) => {
  res.send(players);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
