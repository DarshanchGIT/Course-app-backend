const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db/index");

// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(400).json({ message: "Username and Password required" });

  // check if user already exist or not prior to creating a one

  // Assuming no request made twice on server ->
  // When you use Admin.create({ ... }), it handles both the creation of the new instance and saving it to the database in a single step. There’s no need to explicitly call save() afterward.

  Admin.create({
    username: username,
    password: password,
  })
    .then(() => {
      return res.status(201).json({
        message: "Admin created successfully",
      });
    })
    .catch((err) => {
      // Handle errors during creation
      return res
        .status(500)
        .json({ message: "Error creating Admin", error: err });
    });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // this router basically lets admin create courses by hitting the end point " admin/courses "with the already logged in credentials
  //checking if it exist or not in DB will be handled by  adminMiddleware

  // just create the course
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;

  try {
    // simply course Collection m ek course create kardo
    const newCourse = await Course.create({
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
    });
    //consolelog karwaake dkehte
    console.log(newCourse);

    // Send a response with the created course details
    return res.status(201).json({
      message: "Course created successfully",
      courseId: newCourse._id,
    });
  } catch (err) {
    // Handle any errors that occur during course creation
    return res.status(500).json({
      message: "Failed to create course",
      error: err.message,
    });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // This routes will display all the courses
  try {
    const allCourses = await Course.find({});
    if (!allCourses.length) {
      return res.status(404).json({
        message: "No courses Available",
      });
    }
    // otherwise return
    return res.status(200).json({
      message: "Course fetched successfully!!",
      allCourses,
    });
  } catch (err) {
    // Handle any errors that occur during course creation
    return res.status(500).json({
      message: "Failed to fetch course",
      error: err.message,
    });
  }
});

module.exports = router;
