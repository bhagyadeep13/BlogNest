const Home = require('../models/post');

exports.aboutUsPage = async (req, res, next) => {
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after displaying it
  await req.session.save();
  const post = await Home.find();
  res.render('store/aboutUs', {
    pageTitle: 'About Us',
    currentPage: 'AboutUs',
    projects: post,
    toastMessage: toastMessage,
    IsLoggedIn: req.session.IsLoggedIn,
    user: req.session.user,
    error: [],  
    oldInput: {
      name: '',
      email: '',
      message: ''
    }
  });
};
