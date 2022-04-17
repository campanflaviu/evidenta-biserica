// setup env config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');

// setup express
const app = express();
app.use(express.json());

// mongo db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.on('open', () => console.log('connected to mongo'));


// routing
const churchesRouter = require('./routes/churches');
app.use('/churches', churchesRouter);


// start app on port
app.listen(process.env.PORT || 5000); 
