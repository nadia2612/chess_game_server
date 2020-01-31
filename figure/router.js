const { Router } = require("express");
const Figure = require("./model");
const Game = require("../game/model");
const User = require("../user/model");
const { toData } = require("../auth/jwt");
const Player = require("../player/model");
const Sequelize = require("sequelize");
const checkBishop = require("../validations/bishop");
const checkRook = require("../validations/rook");
const checkPawn = require("../validations/pawn");
const checkKnight = require("../validations/knight");
const checkKing = require("../validations/king");
const checkQueen = require("../validations/queen");

function factory(stream) {
  const router = new Router();

  router.put("/move", async (req, res, next) => {
    try {
      let isTheKingInCheck = false;
      const { userId } = toData(req.body.jwt);
      const game = await Game.findOne({
        where: { id: req.body.gameId },
        include: [{ model: User, attributes: ["id", "name"] }, Figure]
      });
      if (game.users && game.users.length < 2) {
        return res.status(400).send("Wait for the other player to join");
      }
      if (userId != game.currentTurn) {
        res.status(400).send("It's not your turn now.");
      } else {
        if (
          req.body.coordinate_X > 7 ||
          req.body.coordinate_X < 0 ||
          req.body.coordinate_Y > 7 ||
          req.body.coordinate_Y < 0
        ) {
          res.status(400).send("Invalid coordinate");
        }
        const selectedFigure = await Figure.findOne({
          where: { id: req.body.figureId }
        });
        if (selectedFigure.userId !== userId) {
          return res.status(400).send("It is not your turn now.");
        }
        const isThereAFigure = await Figure.findOne({
          where: {
            coordinate_X: req.body.coordinate_X,
            coordinate_Y: req.body.coordinate_Y,
            gameId: req.body.gameId
          }
        });
        if (isThereAFigure) {
          if (isThereAFigure.color === selectedFigure.color) {
            console.log("INVALID MOVE BECAUSE THERE IS A PIECE HERE");
            return res.status(401).send("Invalid move with this piece");
          }
        }
        const isItAHittingMove = isThereAFigure ? true : false;
        switch (selectedFigure.kind) {
          case "Bishop": {
            console.log("BISHOP");
            const isItValid = await checkBishop(
              selectedFigure.coordinate_X,
              selectedFigure.coordinate_Y,
              req.body.coordinate_X,
              req.body.coordinate_Y,
              req.body.gameId
            );
            if (!isItValid) {
              console.log("THIS SHOULD NOT GO IN");
              return res.status(401).send("Invalid move with this piece");
            }
            const opponentKing = await Figure.findOne({
              where: {
                kind: "King",
                color: { [Sequelize.Op.not]: selectedFigure.color },
                gameId: req.body.gameId
              }
            });
            const isItCheck = await checkBishop(
              req.body.coordinate_X,
              req.body.coordinate_Y,
              opponentKing.coordinate_X,
              opponentKing.coordinate_Y,
              req.body.gameId
            );
            if (isItCheck) {
              isTheKingInCheck = true;
            }
            break;
          }
          case "Rook": {
            const isItValid = await checkRook(
              selectedFigure.coordinate_X,
              selectedFigure.coordinate_Y,
              req.body.coordinate_X,
              req.body.coordinate_Y,
              req.body.gameId
            );
            if (!isItValid) {
              return res.status(401).send("Invalid move with this piece");
            }
            const opponentKing = await Figure.findOne({
              where: {
                kind: "King",
                color: { [Sequelize.Op.not]: selectedFigure.color },
                gameId: req.body.gameId
              }
            });
            const isItCheck = await checkRook(
              req.body.coordinate_X,
              req.body.coordinate_Y,
              opponentKing.coordinate_X,
              opponentKing.coordinate_Y,
              req.body.gameId
            );
            if (isItCheck) {
              isTheKingInCheck = true;
            }
            break;
          }
          case "Pawn": {
            const isItValid = await checkPawn(
              selectedFigure.coordinate_X,
              selectedFigure.coordinate_Y,
              req.body.coordinate_X,
              req.body.coordinate_Y,
              selectedFigure.color,
              isItAHittingMove,
              req.body.gameId
            );
            if (!isItValid) {
              return res.status(401).send("Invalid move with this piece");
            }
            break;
          }
          case "King": {
            const isItValid = await checkKing(
              selectedFigure.coordinate_X,
              selectedFigure.coordinate_Y,
              req.body.coordinate_X,
              req.body.coordinate_Y,
              selectedFigure.color,
              req.body.gameId
            );
            if (!isItValid) {
              return res.status(401).send("Invalid move with this piece");
            }
            break;
          }
          case "Knight": {
            if (
              !checkKnight(
                selectedFigure.coordinate_X,
                selectedFigure.coordinate_Y,
                req.body.coordinate_X,
                req.body.coordinate_Y
              )
            ) {
              return res.status(401).send("Invalid move with this piece");
            }
            const opponentKing = await Figure.findOne({
              where: {
                kind: "King",
                color: { [Sequelize.Op.not]: selectedFigure.color },
                gameId: req.body.gameId
              }
            });
            const isItCheck = await checkKnight(
              req.body.coordinate_X,
              req.body.coordinate_Y,
              opponentKing.coordinate_X,
              opponentKing.coordinate_Y,
              req.body.gameId
            );
            if (isItCheck) {
              isTheKingInCheck = true;
            }
            break;
          }
          case "Queen": {
            const isItValid = await checkQueen(
              selectedFigure.coordinate_X,
              selectedFigure.coordinate_Y,
              req.body.coordinate_X,
              req.body.coordinate_Y,
              req.body.gameId
            );
            if (!isItValid) {
              return res.status(401).send("Invalid move with this piece");
            }
            const opponentKing = await Figure.findOne({
              where: {
                kind: "King",
                color: { [Sequelize.Op.not]: selectedFigure.color },
                gameId: req.body.gameId
              }
            });
            const isItCheck = await checkQueen(
              req.body.coordinate_X,
              req.body.coordinate_Y,
              opponentKing.coordinate_X,
              opponentKing.coordinate_Y,
              req.body.gameId
            );
            if (isItCheck) {
              isTheKingInCheck = true;
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

        
        const checkAction = {
          type: "CHECK"
        };

        const checkString = JSON.stringify(checkAction);

        const string = JSON.stringify(action);

        stream.send(string);

        if (isTheKingInCheck) {
          stream.send(checkString);
        }
        
        res.send(games);
      }
    } catch (err) {
      next(err);
    }
  });
  return router;
}

module.exports = factory;
