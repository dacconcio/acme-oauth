module.exports = function(db) {
  return (Place = db.define('Places', {
    name: db.Sequelize.STRING
  }));
};
