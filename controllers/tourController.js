const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // BUILD QUERY
    //1A) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'field'];
    excludeFields.forEach((el) => delete queryObj[el]);

    //2B) Advanced filtering
    // making query into json so that we can use replace method
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    if (req.query.sort) {
      //const query = query.sort(req.query.sort)// sorts in ascending order
      //localhost:3000/api/v1/tours?sort=-price =>sorts in descending order

      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      //Sort using multiple options=>sort(price ratingsAverage)
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Execute query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: fail,
      message: err,
    });
  }
};

exports.createTours = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTours = async (req, res) => {
  try {
    const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,

      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent' });
  }
};

exports.deleteTours = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
