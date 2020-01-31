const Sequelize = require("sequelize");
const sequelize = require("../db");

const Game = sequelize.define("game", {
  currentTurn: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = Game;