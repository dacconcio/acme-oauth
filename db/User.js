module.exports = function(db) {
  return (User = db.define('User', {
    userName: {
      type: db.Sequelize.STRING
    },
    password: {
      type: db.Sequelize.STRING
    },
    githubUserId: {
      type: db.Sequelize.INTEGER
    }
  }));
};
