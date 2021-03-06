// Dependancies
var express = require("express");
var mongoose = require("mongoose");
var session = require('express-session');
var passport = require("passport");
var db = require("./models");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var path = require("path");
var routes = require("./routes");
require("dotenv").config();

// Server
var app = express();
var http = require("http").createServer(app);
var PORT = process.env.PORT || 3001;

// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Session config
app.use(session({
  secret: "NotSoSecretSecret",
  resave: false,
  saveUninitialized: false
}));

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://mek413:123456mk@ds219308.mlab.com:19308/heroku_mbh1cshq";
mongoose.connect(MONGODB_URI);

// Routes ***
// Define API routes here
app.use(routes);

// Send every other request to the React app
// Define any API routes before this runs


// Listener
http.listen(PORT, function () {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});