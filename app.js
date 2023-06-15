const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

//1) MIDDLEWARE

//GET /api/v1/tours/2 200 1.357 ms - 886 => given by morgan
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

// so we have 4 routers now each in one different  file and we can say that each of them is one small application and we then put everything together in our global app file by importing these routers and then mounting the routers

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
