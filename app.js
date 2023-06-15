const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

//1) MIDDLEWARE

app.use(morgan('dev'));
app.use(express.json());

//custom middleware
app.use((req, res, next) => {
  console.log('hello from the middleware');

  next();
});
//custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
