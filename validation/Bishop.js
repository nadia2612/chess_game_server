  function Bishop (initial_X, initial_Y, goal_X, goal_Y, ) {
  if (Math.abs(goal_X - initial_X) !== Math.abs(goal_Y - initial_Y)) {
    return false
  }
  return true
} 
module.exports=Bishop