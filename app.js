const fs = require('fs');
const express = require('express');

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

// this callback function is called route handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    // formatting json with jsend standards,this is also known as envoloping
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
