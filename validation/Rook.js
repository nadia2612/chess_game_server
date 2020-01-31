const Figure = require("../figure/model");
const { buildHorizontal, buildVertical } = require("./jump");

async function Rook(initial_X, initial_Y, goal_X, goal_Y, gameId) {
  if (initial_X === goal_X) {
    const squares = buildVertical(initial_X, initial_Y, goal_Y);

    const promises = squares.map(async square =>
      Figure.findOne({
        where: {
          coordinate_X: square.x,
          coordinate_Y: square.y,
          gameId: gameId
        }
      })
    );
    const whatIsThere = await Promise.all(promises);
    const isThereSomething = whatIsThere.reduce((a, b) => {
      return Boolean(a) || Boolean(b);
    }, false);
    return !isThereSomething;
  } else if (initial_Y === goal_Y) {
    const squares = buildHorizontal(initial_X, goal_X, initial_Y);

    const promises = squares.map(async square =>
      Figure.findOne({
        where: {
          coordinate_X: square.x,
          coordinate_Y: square.y,
          gameId: gameId
        }
      })
    );
    const whatIsThere = await Promise.all(promises);
    const isThereSomething = whatIsThere.reduce((a, b) => {
      return Boolean(a) || Boolean(b);
    }, false);
    return !isThereSomething;
  }
  return false;
}

module.exports = Rook;
