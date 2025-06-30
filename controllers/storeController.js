const User = require("../models/user");
const Home = require("../models/post");

exports.getIndex = async (req, res, next) => {
  //console.log("session value",req.session)
      const post = await Home.find();
      if(post) {
      const toastMessage = req.session.toastMessage;
      req.session.toastMessage = null;
      await req.session.save();
      console.log("user: ", req.session.user);
      console.log("IsLoggedIn: ", req.session.IsLoggedIn);
      res.render("store/index", 
      {
        registeredPosts: post,
        pageTitle: "Index Page",
        currentPage: "index", 
        toastMessage: toastMessage,
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
    });
    }
  };

exports.getPostDetails = (req, res, next) => 
  {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {  
      console.log("Home not found");
      res.redirect("/homes");
    } 
    else {
      res.render("store/post-detail", {
        home: home, 
        pageTitle: "Post Detail",
        currentPage: "post-detail",
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    }
  });
};

exports.getPostList = (req, res, next) => {

  const user = req.session.user;
  const userType = user ? user.userType : '';

  Home.find().then((registeredHomes) => {
    res.render("store/post-list", 
      {
      userType: userType,
      registeredHomes: registeredHomes,
      pageTitle: "Post List",
      currentPage: "ViewPost", 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  });
};

exports.getFavouriteList = async (req, res, next) => 
  {
  const userId = req.session.user._id; // user ID is stored in session
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null;
  await req.session.save();
  const user = await User.findById(userId)
  .populate('favourites')
  //console.log("User: ",await user); // Fetch user print only values of user
  res.render("store/favourite-list", {
    favouritePosts: user.favourites,
    pageTitle: "Favourite Posts",
    currentPage: "favourites", 
    toastMessage: toastMessage,
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user
})
}

exports.postAddToFavourite = async (req, res, next) => {

  const userId = req.session.user._id; // user ID is stored in session
  const postId = req.body.postId; // home ID from the request parameters

  const user = await User.findById(userId);
    console.log("User: ",user,postId); // Fetch user print only values of user
     if (!user.favourites.includes(postId)) 
      {
        user.favourites.push(postId);
        console.log("Post added to favourites successfully");
        await user.save();
        req.session.toastMessage = {type: 'success', text: 'Post added successfully!.'};
        await req.session.save();
      }
      else
      {
        console.log("Post not added to favourites, already exists");
      }
    res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const userId = req.session.user._id; // user ID is stored in session
  const homeId = req.params.postId; // home ID from the request parameters
  const user = await User.findById(userId);
  console.log("User: ", user, homeId); // Fetch user print only values of user
  if(!user)
  {
    console.log("User not found");
  }
  else
  {
    user.favourites = user.favourites.filter(
      (favouriteId) => String(favouriteId) !== String(homeId)
    );
    console.log("Post removed from favourites successfully");
    await user.save();
  }
  req.session.toastMessage = {type: 'success', text: 'Post removed successfully !.'};
  await req.session.save();
  res.redirect("/favourites");
}

exports.getPostDetails = async (req, res, next) => {

  const postId = req.query.postId;  // Assuming postId is passed as a query parameter
  console.log("Post ID:", postId);
  const user = req.session.user;
  if(!user) {
    res.redirect("/signUp");
    return;
  }
  const userType = await user.userType;
  const post = await Home.findById(postId)
    if (!post) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/post-detail", {
        home: post,
        userType: userType,
        pageTitle: "Post Detail",
        currentPage: "post-detail", 
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    }
  }
