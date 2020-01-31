function Queen(initial_X, initial_Y, goal_X, goal_Y) {
  if ((goal_X - initial_X) === 0 || goal_Y - initial_Y === 0 || (Math.abs(goal_X - initial_X) === Math.abs(goal_Y - initial_Y))) {
    return true
  } else {
    return false
  }
}
module.exports = Queen; 