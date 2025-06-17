exports.aboutUsPage = (req, res, next) => {
  res.render('store/aboutUs', {
    pageTitle: 'About Us',
    currentPage: 'AboutUs',
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
