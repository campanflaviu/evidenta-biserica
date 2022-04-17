const express = require('express');

const app = express();
app.use(express.json());

const bisericiRouter = require('./routes/biserici');

app.use('/biserici', bisericiRouter);


app.listen(3005);