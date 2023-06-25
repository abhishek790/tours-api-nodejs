const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//aliasing
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //execute query
    const tours = await features.query;

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

//Aggregation Pipeline is an extermely powerful and useful mongodb framework for data aggregation
// The idea is that we define a pipeline that all documents from a certain collection go through where they are processed step by step in order to transform them into aggregated results.

//creating function that is gonna calculate a couple of statistics about our tours
exports.getTourStats = async (req, res) => {
  try {
    //aggregation pipeline is a bit like doing regular query,the difference is we can manipulate data in a couple of different steps and to define these steps we pass in an array of so called stages. the documents then pass through these stages step by step in a sequence as we define

    // match => it is used to select or filter certain documents , it's just like a filter object in mongodb
    // each of the stages is an object
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      //group=> it allows us to group documents together using accumulator, and accumulator is for example calculating an average
      {
        $group: {
          // the first thing is we always need to specify_id,because this is where we gonna specify what we want to group by For now, we say null here because we want to have everything in one group so that we can calculate the statistics for all of the tours together and not separate it by groups. But we can specify different field name in _id to group by for eg- difficulty, price

          // _id:null,
          // _id: '$ratingsAverage',

          _id: { $toUpper: '$difficulty' },
          // calculate total numbers of tour
          // for each of the documents that's gonna go through this pipeline we are gonna add 1
          numTours: { $sum: 1 },
          //calculate total numbers of rating
          numRatings: { $sum: '$ratingsQuantity' },
          // avg mathematical operator for calculating avg in mongoDB and we also write name of field ,whose average we want to calculate
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      // sort stage
      {
        // here we can specify which field we want to sort this by
        // here in the sorting we actually need to use the field names that we specified up here in the group name
        // 1 is for ascending
        $sort: { avgPrice: 1 },
      },
      // we can also repeat stages
      {
        // _id is now difficulty because we have specified above
        //$ne, refers to not equal to
        // selects all the documents that are not easy
        $match: { _id: { $ne: 'EASY' } },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.param.year * 1;
    const plan = await Tour.aggregate([
      {
        //unwind will basically deconstruct an array field from the input documents and then output one document for each element of the array.
        //we want to have one tour for each of these dates in the array. and with unwind we can exactly do that
        $unwind: '$startDates',
      },
      {
        // error
        // this part does not run
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          //  $month Returns the month of a date as a number between 1 and 12.
          _id: { $month: '$startDates' },
          // counting number of tours start in that month
          numTourStarts: { $sum: 1 },
          // to specify 2 or more than 2 different tours in one field we need to make array. we do that by using push
          tours: { $push: '$name' },
        },
      },
      {
        // used to add fields , here we add month field with value form id
        $addFields: { month: '$_id' },
      },
      {
        // since we added 0 to _id it will not be shown to client
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        // it will only allow 12 documnets to be displayed
        $limit: 12,
      },
    ]);
    console.log(plan);
    res.status(200).json({
      message: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
