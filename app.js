const fs = require('fs');
const express = require('express');

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

// what we want to implement in this lecture is a way of getting only one tour
// define a route that can accept a variable
// :id => we created variable id
// we can also define multiple variable
//:y?=> this makes that parameter optional (meaning if we didnot specify in the 3rd parameter, it will still work)
app.get('/api/v1/tours/:id', (req, res) => {
  // these variable in the url are called parameters
  // param is where the all the parameters,all the variables that we define in the url are stored
  console.log(req.params);
  const id = Number(req.params.id);
  // what find will do is , it will only create an array where below comparison is true
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length)
  if (!tour) {
    // return exit the function immediately
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
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});

// easy way to define parameters and right in the url and then how to read these parameters and how to respond to that

// what we want to implement in this lecture is a way of getting only one tour
