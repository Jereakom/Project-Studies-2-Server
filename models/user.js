var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes){
    var User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        unique:true
      },
      password: {
        type: DataTypes.STRING
      },
      wins: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      games: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      losses: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ties: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      instanceMethods: {
        generateHash: function(password) {
           return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
       },
       validPassword: function(password) {
           return bcrypt.compareSync(password, this.password);
       }
      }
    });
    return User;
  };
