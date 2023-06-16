const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

// param middleware
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is:${val}`);
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

// middleware
exports.checkBody = (req, res, next) => {
  console.log(req.body.price);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ status: 'fail', message: 'invalid body' });
  }
  next();
};

exports.getTours = (req, res) => {
  const id = Number(req.params.id);

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.createTours = (req, res) => {
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

exports.updateTours = (req, res) => {
  const id = Number(req.params.id);

  const updateTour = tours[id];

  const userData = req.body;

  const updatedData = { ...updateTour, ...userData };
  tours[id] = updatedData;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(200).json({
        status: 'success',
        data: {
          Updatedtour: updatedData,
        },
      });
    }
  );
};

exports.deleteTours = (req, res) => {
  const id = req.params.id;
  tours[id] = null;
  res.status(204).json({
    status: 'success',
    data: tours[id],
  });
};
