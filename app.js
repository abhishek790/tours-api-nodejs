const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

// 2)ROUTE HANDLER

//------------tour resources----------
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTours = (req, res) => {
  const id = Number(req.params.id);

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTours = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTours = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      message: '<updated tour here>',
    },
  });
};

const deleteTours = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ----------users resources------------

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined ',
  });
};

//3) ROUTES
//created a new routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTours);
tourRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
