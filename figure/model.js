const Sequelize = require("sequelize");
const sequelize = require("../db");
const Player = require("../player/model");
const User = require("../user/model");
const Game = require("../game/model");

const Figure = sequelize.define("figures", {
  kind: {
    type: Sequelize.STRING,
    allowNull: false
  },
  coordinate_X: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  coordinate_Y: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Figure.belongsTo(User, { through: Player });
Figure.belongsTo(Game);
User.hasMany(Figure)
Game.hasMany(Figure)


module.exports = Figure;