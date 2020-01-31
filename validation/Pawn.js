
function hittingMove(initial_X, initial_Y, goal_X, goal_Y, color) {
  if (color === 'white') {
    if (goal_Y !== initial_Y + 1) {
      return false
    } else if (goal_X === initial_X + 1 || goal_X === initial_X - 1) {
      return true
    } else {
      return false
    }
  } else if (color === 'black') {
    if (goal_Y !== initial_Y - 1) {
      return false
    } else if (goal_X === initial_X + 1 || goal_X === initial_X - 1) {
      return true
    } else {
      return false
    }
  }
}

function nonHittingMove(initial_X, initial_Y, goal_X, goal_Y, color) {
  if (initial_X !== goal_X) {
    return false
  }
  if (color === 'white') {
    if (initial_Y === 1) {
      if (goal_Y === initial_Y + 1 || goal_Y === initial_Y + 2) {
        return true;
      }
    } else if (goal_Y === initial_Y + 1) {
      return true;
    } else {
      return false;
    }
  } else if (color === 'black') {
    if (initial_Y === 6) {
      if (goal_Y === initial_Y - 1 || goal_Y === initial_Y - 2) {
        return true;
      }
    } else if (goal_Y === initial_Y - 1) {
      return true;
    }
  } else {
    return false;
  }
}

function Pawn(initial_X, initial_Y, goal_X, goal_Y, color, isItAHittingMove) {
  if (isItAHittingMove) {
    return hittingMove(initial_X, initial_Y, goal_X, goal_Y, color)
  } else {
    return nonHittingMove(initial_X, initial_Y, goal_X, goal_Y, color)
  }
}
module.exports = Pawn; 