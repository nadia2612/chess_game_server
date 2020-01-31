function Rook(initial_X, initial_Y, goal_X, goal_Y) {
  if (initial_X === goal_X || initial_Y === goal_Y) {
    return true;
  } else {
    return false;
  }
}
module.exports = Rook; 