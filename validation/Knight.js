function Knight(initial_X, initial_Y, goal_X, goal_Y) {
  if ((Math.abs(goal_X - initial_X) === 2 && Math.abs(goal_Y - initial_Y) === 1) || (Math.abs(goal_X - initial_X) === 1 && Math.abs(goal_Y - initial_Y) === 2)) {
    return true
  } else {
    return false
  }
}
module.exports = Knight;