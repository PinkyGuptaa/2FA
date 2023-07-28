const express = require("express");
const app = express();
require('dotenv').config();
const Port = process.env.SERVER_PORT || 4000;
const db = require("./util/db_connection");

const cors = require("cors");
const bodyParser = require('body-parser');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



app.use('/api/users', require('./controller/userController'))
app.listen(Port, () => {
    try {
      console.log(`Server started at port:  ${Port}!`);
      db.authenticate()
        .then(() => {
          console.log(`${process.env.DB_DIALECT} database is connected!`);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error(`Error while connected to server ${error}!`);
    }
  });
  