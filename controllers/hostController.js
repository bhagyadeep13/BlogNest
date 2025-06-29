const Home = require("../models/post");
const fs = require('fs');
const User = require('../models/user');
const { register } = require("module");

exports.getAddPost = (req, res, next) => {
  res.render("host/details", {
    pageTitle: "Add Home to airbnb",
    currentPage: "AddNewPost",
    editing: false,
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Post not found for editing.");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/details", {
      home: home,
      pageTitle: "Edit your Post",
      currentPage: "EditPost",
      editing: editing, 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  });
};

exports.getHostHomes = async (req, res, next) => {
      const userId = req.session.user._id;
      const user = await User.findById(userId)
      .populate('homes')
      res.render("host/author-post-list", {
      registeredPosts: user.homes,
      pageTitle: "Host Homes List",
      toastMessage: req.session.toastMessage,
      currentPage: "host-homes", 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
    req.session.toastMessage = null; // Clear the toast message after rendering
  };

exports.postAddPost = async (req, res, next) => {

  const { title, subtitle,category, description, authorName, photo,createdAt} = req.body;

  console.log(req.body);
    if(!req.file) // Check if a file was uploaded
    {
      return res.status(400).send("Only image files are allowed.");
      // You can also render an error page or redirect to an error route
    }
    
  const photo_path = req.file.path; // Get the filename from the uploaded file
  const home = new Home({
    title,
    subtitle,
    authorName,
    category,
    description,
    photo: photo_path, // Use the path of the uploaded
    createdAt,
  });
  console.log(home)
  await home.save()
    console.log("Home Saved successfully");
    const userId2 = req.session.user._id; // Add created by field (user id) to home
    console.log(userId2);
    const homeId = home._id; // Use the _id of the newly created home
    const user = await User.findById(userId2);
    console.log("User: ", user, userId2); // Fetch user print only values of user
    if (!user.homes.includes(homeId)) {
        user.homes.push(homeId);
        await user.save();
    }
  res.redirect("/");
};

exports.postEditPost = async (req, res, next) => {
  const { id,subtitle,title, authorName, category, createdAt, photo, description } =
    req.body;
    console.log(title, authorName, category, createdAt, description);
  console.log(req.body);
  const user = req.session.user;
  console.log("User ID: ", user);
    const post = await Home.findById(id);
  if (post) {
    post.title = title;
    post.subtitle = subtitle;
    post.authorName = authorName;
    post.category = category;
    post.createdAt = createdAt;
    if(req.file) // Check if a new file was uploaded
    {
        fs.unlink(post.photo, (err) => {
          if (err) {
            console.error("Error deleting old photo:", err);
          }
        });
      post.photo = req.file.path; // Update the photo with the new file
    }
    post.description = description;
    await post.save();
    req.session.toastMessage = {type: 'info',
                                text: 'Post Edited successfully!.'}
    await req.session.save();
    console.log("Post updated successfully"); 
  }
  else
  {
    console.log("Post not found for editing.");
  }
    res.redirect("/host/host-home-list",);
};

exports.getDeletePost = async (req, res, next) => {
      const userId = req.session.user._id;
      const user = await User.findById(userId)
    .populate('homes')
    if(user)
    {
      res.render("host/delete-post", {
        registeredPosts: user.homes,
        pageTitle: "Delete Post",
        currentPage: "DeletePost",
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    }
    else
    {
      res.render('404', {
        pageTitle: "Error",
        currentPage: "Error",
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user,
        message: "User not found"
      });
    }
}

exports.postDeletePost = async (req, res, next) => {
  const postId = req.params.postId;
  console.log("Came to delete ", postId);
  const home = await Home.findByIdAndDelete(postId)
  if(!home)
  {
    console.log("Post not found for deletion.");
    return res.render('404', {
      pageTitle: "Error",
      currentPage: "Error",
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user,
      message: "Post not found"
    });
  }
  console.log("Post deleted successfully");
  const userId = req.session.user._id;
    const user = await User.findById(userId);
      console.log("User ID: ", await user,await home);
    if (user) {
      // Remove the home from the user's homes array
      user.homes = user.homes.filter(homeId => homeId.toString() !== postId);
      await user.save();
    }
    res.render("host/delete-post",{
                                registeredPosts: user.homes,
                                pageTitle: "Delete Post",
                                currentPage: "DeletePost",
                                IsLoggedIn : req.session.IsLoggedIn,
                                user: req.session.user});
  }