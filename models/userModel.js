require('dotenv').config();
const { Sequelize,DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken")
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  });
  const User = sequelize.define('User', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   allowNull: false,
    // },
    number:{
      type: DataTypes.STRING,
      allowNull: false
    }, 
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'User'
  });

  User.prototype.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        number: this.number
    },process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
    return token;
    
  }
sequelize.sync({ force: true }); 
module.exports.User = User;
