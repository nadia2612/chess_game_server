const buildHorizontal = (initial_X, goal_X, initial_Y) => {
  const result = [];
  const difference = Math.abs(initial_X - goal_X);
  for (let i = 1; i < difference; i++) {
    const calculateGoalPosition = (goal_X, initial_X, i) =>
      goal_X < initial_X ? initial_X - i : initial_X + i;
    result.push({
      x: calculateGoalPosition(initial_X, goal_X, i),
      y: initial_Y
    });
  }
  return result;
};
const buildVertical = (initial_X, initial_Y, goal_Y) => {
  const result = [];
  const difference = Math.abs(initial_Y - goal_Y);
  for (let i = 1; i < difference; i++) {
    const calculateGoalPosition = (goal_Y, initial_Y, i) =>
      goal_Y < initial_Y ? initial_Y - i : initial_Y + i;
    result.push({
      x: initial_X,
      y: calculateGoalPosition(initial_Y, goal_Y, i)
    });
  }
  return result;
};

const buildDiagonal = (initial_X, goal_X, initial_Y, goal_Y) => {
  const result = [];
  const difference = Math.abs(initial_Y - goal_Y);
  for (let i = 1; i < difference; i++) {
    const calculateGoalPosition_X = (goal_X, initial_X, i) =>
      goal_X < initial_X ? initial_X - i : initial_X + i;
    const calculateGoalPosition_Y = (goal_Y, initial_Y, i) =>
      goal_Y < initial_Y ? initial_Y - i : initial_Y + i;
    result.push({
      x: calculateGoalPosition_X(initial_X, goal_X, i),
      y: calculateGoalPosition_Y(initial_Y, goal_Y, i)
    });
  }
  console.log("RESULT", result);
  return result;
};

module.exports = { buildHorizontal, buildVertical, buildDiagonal };
