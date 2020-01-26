const { Router } = require("express");
const { toData } = require("../auth/jwt");
const Game = require("./model");
const router = new Router();
const Player = require("../player/model");
const Figure = require("../figure/model");
const User = require("../user/model");

// router.get("/game", async (req, res) => {
//   const game = await Game.findAll({ include: [{ model: User, attributes: ['id', 'name'] }] });
//   res.send(game);
// });

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

router.post("/game", async (req, res, next) => {
  try {
    const game = {
      username1: req.body.name,
      username2: null
    };
    const createdGame = await Game.create(game);
    res.send(createdGame);
  } catch (error) {
    next(error);
  }
});

router.put("/game/join", async (req, res, next) => {
  try {
    const { userId } = toData(req.body.jwt);
    const player = await Player.create({
      gameId: req.body.gameId,
      userId,
      color: req.body.color
    });
    if (req.body.color === "white") {
      await createWhiteFigures(userId, req.body.gameId);
    } else {
      await createBlackFigures(userId, req.body.gameId);
    }

    res.send(player);
  } catch (error) {
    next(error);
  }
});

router.get("/game", async (req, res) => {
  const game = await Game.findAll();
  res.send(game);
});

module.exports = router;
