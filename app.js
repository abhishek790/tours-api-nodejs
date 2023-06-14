const fs = require('fs');
const express = require('express');

const app = express();

// we use app.use to use middleware
// this express.josn() is a middleware, middleware is just a function that can modify the incoming request data. It's called middleware because it stands between in the middle of request and response. so it's just a steps request goes through while being processed
// and the steps the request goes through in this example is simply that the data form the body is added to the request object
app.use(express.json());

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

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;

  // allows us to create a new object by merging two existing objects
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
