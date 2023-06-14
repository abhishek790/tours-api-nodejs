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

// request object is what holds all the data ,the information about the request that was done by the client
// express does not put that body data on the request, so inorder to have that data available we have to use something called middleware
app.post('/api/v1/tours', (req, res) => {
  // body is the property that is gonna be available on the request because we used that middleware
  console.log(req.body);
  res.send('Done');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
