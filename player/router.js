const express = require("express");
const { toData } = require("../auth/jwt")
const Player = require("./model");
const Game = require('../game/model')
const User = require('../user/model')
const { Router } = express
const router = new Router();

  router.get("/player", async (req, res, next) => {

    try {
      const players = await Player.findAll();

      res.send(players);
    } catch (error) {
      next(error)
    }
  });

  router.post("/player", async (req, res, next) => {
    try {
      const game = await Player.create(req.body);
      res.json(game);
    } catch (err) {
      next(err);
    }
  });



module.exports = router;