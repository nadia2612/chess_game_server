const { Router } = require("express");
const Figure = require("./model");
const Game = require("../game/model");
const User = require("../user/model");
const { toData } = require("../auth/jwt");
const Player = require("../player/model");
const Sequelize = require("sequelize");

function factory(stream) {
  const router = new Router();

  router.put("/move", async (req, res) => {
    try {
      const { userId } = toData(req.body.jwt);
      const game = await Game.findOne({ where: { id: req.body.gameId } });
      if (userId != game.currentTurn) {
        res.status(400).send("It's not your turn now.");
      } else {
        await Figure.destroy({
          where: {
            gameId: req.body.gameId,
            coordinate_X: req.body.coordinate_X,
            coordinate_Y: req.body.coordinate_Y
          }
        });
        await Figure.update(
          {
            coordinate_X: req.body.coordinate_X,
            coordinate_Y: req.body.coordinate_Y
          },
          { where: { id: req.body.figureId } }
        );
        const board = await Figure.findAll({
          where: { gameId: req.body.gameId }
        });
        const currentPlayer = await Player.findOne({
          where: {
            gameId: req.body.gameId,
            userId: {
              [Sequelize.Op.not]: game.currentTurn
            }
          }
        });
        console.log("CURRENT", currentPlayer);
        await Game.update(
          { currentTurn: currentPlayer.userId },
          { where: { id: req.body.gameId } }
        );
        const games = await Game.findAll({
          include: [{ model: User, attributes: ["id", "name"] }, Figure]
        });
        const action = {
          type: "ALL_GAMES",
          payload: games
        };

        const string = JSON.stringify(action);

        stream.send(string);

        res.send(games);
      }
    } catch (err) {
      next(err);
    }
  });
  return router;
}

module.exports = factory;
