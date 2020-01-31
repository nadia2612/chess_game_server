const Sequelize = require("sequelize");
const sequelize = require("../db");
const Game = require("../game/model");
const User = require("../user/model");

const Player = sequelize.define("player", {
  color: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
Game.belongsToMany(User, { through: Player });
User.belongsToMany(Game, { through: Player });
module.exports = Player;
