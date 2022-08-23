const express = require("express");
const router = express.Router();
const { playGame } = require("../controllers/game");

router.route("/play").get(playGame);

module.exports = router;
