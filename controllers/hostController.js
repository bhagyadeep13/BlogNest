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
      const toastMessage = req.session.toastMessage;
      req.session.toastMessage = null; // Clear the toast message after rendering
      const user = await User.findById(userId)
      .populate('homes')
      res.render("host/author-post-list", {
      registeredPosts: user.homes,
      pageTitle: "Host Homes List",
      toastMessage: toastMessage,
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
    const toastMessage = {type: 'success', text: 'Post added successfully!.'};
    req.session.toastMessage = toastMessage; // Store the toast message in the session
    await req.session.save(); // Save the session to persist the message
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
      const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after rendering
  // Re-render the delete-post page with updated posts
      const user = await User.findById(userId)
    .populate('homes')
    if(user)
    {
      res.render("host/delete-post", {
        registeredPosts: user.homes,
        pageTitle: "Delete Post",
        currentPage: "DeletePost",
        toastMessage: toastMessage,
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
  const postId = req.body.postId;
  console.log("Came to delete ", postId);

  // Find the home first (to get the photo path)
  const home = await Home.findById(postId);
  if (!home) {
    console.log("Post not found for deletion.");
    res.status(404).send("Post not found");
  }

  // Delete the image file associated with this post
  if (home && home.photo) {
    fs.unlink(home.photo, (err) => {
      if (err) {
        console.error("Error deleting photo file:", err);
      }
    });
  }

  // Delete the post from the database
  await Home.findByIdAndDelete(postId);
  console.log("Post deleted successfully");

  // Remove the home from the user's homes array
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('homes');
  if (user) {
    user.homes = user.homes.filter(homeId => homeId.toString() !== postId);
    await user.save();
    req.session.toastMessage = {type: 'error', text: 'Post deleted successfully!.'};
    await req.session.save();
  }
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after rendering
  // Re-render the delete-post page with updated posts
  res.render("host/delete-post", {
    registeredPosts: user.homes,
    pageTitle: "Delete Post",
    currentPage: "DeletePost",
    toastMessage: toastMessage,
    IsLoggedIn: req.session.IsLoggedIn,
    user: req.session.user
  });
};