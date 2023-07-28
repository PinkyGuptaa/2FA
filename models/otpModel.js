require('dotenv').config();
const { Sequelize,DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken")

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  });
  const Otp = sequelize.define('Otp', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   allowNull: false,
    // },
    number:{
      type: DataTypes.STRING,
      allowNull: false
    }, 
    otp:{
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        index: {expires: 300}
      }
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'Otp'
  });



 sequelize.sync({ force: true }); 

  
module.exports.Otp = Otp;
