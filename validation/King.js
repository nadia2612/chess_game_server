const Figure = require("../figure/model");

async function King(initial_X, initial_Y, goal_X, goal_Y, color, gameId) {
  const isItCastling = await isCastling(
    initial_X,
    initial_Y,
    goal_X,
    goal_Y,
    color,
    gameId
  );
  if (isItCastling) {
    return true;
  }
  if (
    (Math.abs(goal_X - initial_X) === 1 && Math.abs(goal_Y - initial_Y) < 2) ||
    (Math.abs(goal_X - initial_X) < 2 && Math.abs(goal_Y - initial_Y) === 1)
  ) {
    return true;
  } else {
    return false;
  }
}

async function isCastling(initial_X, initial_Y, goal_X, goal_Y, color, gameId) {
  if (color === "white" && initial_X === 4 && initial_Y === 0 && goal_Y === 0) {
    if (goal_X === 6) {
      const Rook = await Figure.findOne({
        where: { coordinate_X: 7, coordinate_Y: 0, gameId: gameId }
      });
      const isEmpty = await Figure.findOne({
        where: { coordinate_X: 5, coordinate_Y: 0, gameId: gameId }
      });
      const isEmpty2 = await Figure.findOne({
        where: { coordinate_X: 6, coordinate_Y: 0, gameId: gameId }
      });
      if (Rook.kind === "Rook" && !isEmpty && !isEmpty2) {
        await Figure.update(
          {
            coordinate_X: 5,
            coordinate_Y: 0
          },
          { where: { id: Rook.id } }
        );
        return true;
      }
    } else if (goal_X === 2) {
      const Rook = await Figure.findOne({
        where: { coordinate_X: 0, coordinate_Y: 0, gameId: gameId }
      });
      const isEmpty = await Figure.findOne({
        where: { coordinate_X: 1, coordinate_Y: 0, gameId: gameId }
      });
      const isEmpty2 = await Figure.findOne({
        where: { coordinate_X: 2, coordinate_Y: 0, gameId: gameId }
      });
      const isEmpty3 = await Figure.findOne({
        where: { coordinate_X: 3, coordinate_Y: 0, gameId: gameId }
      });
      if (Rook.kind === "Rook" && !isEmpty && !isEmpty2 && !isEmpty3) {
        await Figure.update(
          {
            coordinate_X: 3,
            coordinate_Y: 0
          },
          { where: { id: Rook.id } }
        );
        return true;
      }
    }
  } else if (
    color === "black" &&
    initial_X === 4 &&
    initial_Y === 7 &&
    goal_Y === 7
  ) {
    if (goal_X === 6) {
      const Rook = await Figure.findOne({
        where: { coordinate_X: 7, coordinate_Y: 7, gameId: gameId }
      });
      const isEmpty = await Figure.findOne({
        where: { coordinate_X: 5, coordinate_Y: 7, gameId: gameId }
      });
      const isEmpty2 = await Figure.findOne({
        where: { coordinate_X: 6, coordinate_Y: 7, gameId: gameId }
      });
      if (Rook.kind === "Rook" && !isEmpty && !isEmpty2) {
        await Figure.update(
          {
            coordinate_X: 5,
            coordinate_Y: 7
          },
          { where: { id: Rook.id } }
        );
        return true;
      }
    } else if (goal_X === 2) {
      const Rook = await Figure.findOne({
        where: { coordinate_X: 0, coordinate_Y: 7, gameId: gameId }
      });
      const isEmpty = await Figure.findOne({
        where: { coordinate_X: 1, coordinate_Y: 7, gameId: gameId }
      });
      const isEmpty2 = await Figure.findOne({
        where: { coordinate_X: 2, coordinate_Y: 7, gameId: gameId }
      });
      const isEmpty3 = await Figure.findOne({
        where: { coordinate_X: 3, coordinate_Y: 7, gameId: gameId }
      });
      if (Rook.kind === "Rook" && !isEmpty && !isEmpty2 && !isEmpty3) {
        await Figure.update(
          {
            coordinate_X: 3,
            coordinate_Y: 7
          },
          { where: { id: Rook.id } }
        );
        return true;
      }
    }
  }
  return false;
}

module.exports = King;
