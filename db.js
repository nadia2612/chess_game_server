const Sequelize = require('sequelize')

const databaseUrl = process.env.DATABASE_URL ||  'postgres://postgres:secret@localhost:5432/postgres'
// 'postgres://ndwldfncsoctue:420f8be8b39fd293b8e244ed6b3ce26caaad2eb009dd40ca4efa6d931e430189@ec2-54-195-252-243.eu-west-1.compute.amazonaws.com:5432/d8812vph1851mb'
const db = new Sequelize(databaseUrl)

db
  .sync({ force: false })
  .then(() => console.log('Database connected'))
  .catch(console.error)

module.exports = db