const express = require("express");
const { toData } = require("../auth/jwt")
const Player = require("./model");
const Game = require('../game/model')
const User = require('../user/model')
const { Router } = express


function factory(stream) {
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
      const { userId } = toData(req.body.jwt)
      const player = await Player.create({ userId, gameId: req.body.gameId });  //userId, gameId:req.body.gameId}
      const updatedGame = await Game.findByPk(req.body.gameId, { include: [{ model: User, attributes: ['id', 'name'] }] })

      const action = {
        type: "UPDATE_GAME",
        payload: updatedGame
      }
      const string = JSON.stringify(action)
      stream.send(string)
      res.send(player);
    } catch (error) {
      next(error);
    }
   
  })

  return router
}



module.exports = factory;