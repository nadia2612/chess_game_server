const { Router } = require("express");
const { toData } = require("../auth/jwt");
const Game = require("./model");

const Player = require("../player/model");
const Figure = require("../figure/model");
const User = require("../user/model");

const createWhiteFigures = async (userId, gameId) => {
  await Promise.all([
    Figure.create({
      kind: "King",
      coordinate_X: 4,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Queen",
      coordinate_X: 3,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),

    Figure.create({
      kind: "Bishop",
      coordinate_X: 2,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Bishop",
      coordinate_X: 5,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),

    Figure.create({
      kind: "Knight",
      coordinate_X: 1,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Knight",
      coordinate_X: 6,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),

    Figure.create({
      kind: "Rook",
      coordinate_X: 0,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Rook",
      coordinate_X: 7,
      coordinate_Y: 0,
      color: "white",
      userId,
      gameId
    }),

    Figure.create({
      kind: "Pawn",
      coordinate_X: 0,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 1,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 2,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 3,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 4,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 5,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 6,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 7,
      coordinate_Y: 1,
      color: "white",
      userId,
      gameId
    })
  ]);
};

const createBlackFigures = async (userId, gameId) => {
  await Promise.all([
    Figure.create({
      kind: "King",
      coordinate_X: 4,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Queen",
      coordinate_X: 3,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Bishop",
      coordinate_X: 2,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Bishop",
      coordinate_X: 5,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Knight",
      coordinate_X: 1,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Knight",
      coordinate_X: 6,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Rook",
      coordinate_X: 0,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Rook",
      coordinate_X: 7,
      coordinate_Y: 7,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 0,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 1,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 2,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 3,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 4,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 5,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 6,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    }),
    Figure.create({
      kind: "Pawn",
      coordinate_X: 7,
      coordinate_Y: 6,
      color: "black",
      userId,
      gameId
    })
  ]);
};

function factory(stream) {
  const router = new Router();

  router.post("/join", async (req, res, next) => {
    try {
      const { userId } = toData(req.body.jwt);
      const player = await Player.create({
        gameId: req.body.gameId,
        userId,
        color: req.body.color
      });
      if (req.body.color === "white") {
        await createWhiteFigures(userId, req.body.gameId);
        Game.update(
          { currentTurn: userId },
          { where: { id: req.body.gameId } }
        );
      } else {
        await createBlackFigures(userId, req.body.gameId);
      }
      const updatedGame = await Game.findByPk(req.body.gameId, {
        include: [{ model: User, attributes: ["id", "name"] }, Figure]
      });

      const action = {
        type: "UPDATE_GAME",
        payload: updatedGame
      };
      const string = JSON.stringify(action);
      stream.send(string);

      res.send(player);
    } catch (error) {
      next(error);
    }
  });

  router.post("/game", async (req, res, next) => {
    try {
      const game = {
        username: req.body.name
      };
      const newGame = await Game.create(game);
      const action = {
        type: "NEW_GAME",
        payload: newGame
      };

      const string = JSON.stringify(action);
      stream.send(string);
      res.send(newGame);
    } catch (error) {
      next(error);
    }
  });
  return router;
}

module.exports = factory;
