const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

const User = require('./User.js')(db);
const Place = require('./Place.js')(db);

User.hasMany(Place);
Place.belongsTo(User);

db.sync({ force: true });

module.exports = {
  User,
  Place
};
