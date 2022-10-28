const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log('connection is successful with DB');
  })
  .catch((err) => {
    console.log(err);
  });
