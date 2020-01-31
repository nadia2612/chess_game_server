
const { buildDiagonal } = require('./jump')
const Figure = require('../figure/model')

function isMoveValid(initial_X, initial_Y, goal_X, goal_Y) {
  if (Math.abs(goal_X - initial_X) !== Math.abs(goal_Y - initial_Y)) {
    return false
  }
  return true
} 
async function Bishop (initial_X, initial_Y, goal_X, goal_Y, gameId) {
  if (isMoveValid(initial_X, initial_Y, goal_X, goal_Y)) {
    const squares = buildDiagonal(initial_X, goal_X, initial_Y, goal_Y)
    const promises = squares.map(async square => Figure.findOne({ where: { coordinate_X: square.x, coordinate_Y: square.y, gameId: gameId } }))
    const whatIsThere = await Promise.all(promises)
    const isThereSomething = whatIsThere.reduce((a, b) => { return (Boolean(a) || Boolean(b)) }, false)
    return !isThereSomething
  } else {
    return false
  }
} 	
module.exports=Bishop