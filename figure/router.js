const { Router } = require("express");
const Figure = require("./model");
const Game = require("../game/model");
const User = require("../user/model");
const { toData } = require("../auth/jwt");
const Player = require("../player/model");
const Sequelize = require("sequelize");
const checkBishop = require('../validation/Bishop')
const checkRook = require('../validation/Rook')
const checkPawn = require('../validation/Pawn')
const checkKnight = require('../validation/Knight')
const checkKing = require('../validation/King')
const checkQueen = require('../validation/Queen')

function factory(stream) {
  const router = new Router();

  router.put("/move", async (req, res) => {
    try {
      const { userId } = toData(req.body.jwt);
      const game = await Game.findOne({ where: { id: req.body.gameId } });
      if (userId != game.currentTurn) {
        res.status(400).send("It's not your turn now.");
      } else {
        if (req.body.coordinate_X > 7 || req.body.coordinate_X < 0 || req.body.coordinate_Y > 7 || req.body.coordinate_Y < 0) {
          res.status(400).send('Invalid coordinate')
        }
        const selectedFigure = await Figure.findOne({ where: { id: req.body.figureId } })
        if (selectedFigure.userId !== userId) {
          return res.status(400).send('It is not your turn now.')
        }
        const isThereAFigure = await Figure.findOne({ where: { coordinate_X: req.body.coordinate_X, coordinate_Y: req.body.coordinate_Y, gameId: req.body.gameId } })
        if (isThereAFigure) {
          if (isThereAFigure.color === selectedFigure.color) {
            console.log('INVALID MOVE BECAUSE THERE IS A PIECE HERE')
            return res.status(401).send('Invalid move with this piece')
          }
        }
        const isItAHittingMove = isThereAFigure ? true : false
        switch (selectedFigure.kind) {
          case 'Bishop': {
            if (!checkBishop(selectedFigure.coordinate_X, selectedFigure.coordinate_Y, req.body.coordinate_X, req.body.coordinate_Y)) {
              return res.status(401).send('Invalid move with this piece')
            }
            break;
          }
          case 'Rook': {
            if (!checkRook(selectedFigure.coordinate_X, selectedFigure.coordinate_Y, req.body.coordinate_X, req.body.coordinate_Y)) {
              return res.status(401).send('Invalid move with this piece')
            }
            break;
          }
          case 'Pawn': {
            if (!checkPawn(selectedFigure.coordinate_X, selectedFigure.coordinate_Y, req.body.coordinate_X, req.body.coordinate_Y, selectedFigure.color, isItAHittingMove)) {
              return res.status(401).send('Invalid move with this piece')
            }
            break;
          }
          case 'King': {
            if (!checkKing(selectedFigure.coordinate_X, selectedFigure.coordinate_Y, req.body.coordinate_X, req.body.coordinate_Y)) {
              return res.status(401).send('Invalid move with this piece')
            }
            break;
          }
          case 'Knight': {
            if (!checkKnight(selectedFigure.coordinate_X, selectedFigure.coordinate_Y, req.body.coordinate_X, req.body.coordinate_Y)) {
              return res.status(401).send('Invalid move with this piece')
            }
            break;
          }
          case 'Queen': {
            if (!checkQueen(selectedFigure.coordinate_X, selectedFigure.coordinate_Y, req.body.coordinate_X, req.body.coordinate_Y)) {
              return res.status(401).send('Invalid move with this piece')
            }
            break;
          }
        }
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
        // const board = await Figure.findAll({
        //   where: { gameId: req.body.gameId }
        // });
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
