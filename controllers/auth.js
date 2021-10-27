const User = require('../models/User.js');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check that user exists by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid email', 401));
    }

    // Check that password match
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid password', 401));
    }

    res.status(200).json({
      user,
      token: '12kjsbndjlavs',
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotpassword = (req, res, next) => {
  res.send('Forgot Password Route');
};

exports.resetpassword = (req, res, next) => {
  res.send('Reset Password Route');
};
