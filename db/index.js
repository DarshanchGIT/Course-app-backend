const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:W6PyEwrklahbgRzD@cluster0.lhcugcv.mongodb.net/")
  // if I want to specify a databse just add it at the last 
  // for instanace => mongodb+srv://admin:W6PyEwrklahbgRzD@cluster0.lhcugcv.mongodb.net/database_name
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Problem connecting with database", err));

// Define schemas
const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
  purchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const CourseSchema = new mongoose.Schema({
  // Schema definition here
  title: String,
  description: String,
  price: Number,
  imageLink: String,
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
};
