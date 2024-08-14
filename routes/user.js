const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index");

// User Routes
router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error processing signup",
      error: err.message,
    });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  //this is an open endpoint no need to authenticate user at all
  try {
    const availableCourses = await Course.find({});
    if (!availableCourses.length) {
      return res.status(404).json({
        message: "No courses Available",
      });
    }
    // otherwise return
    return res.status(200).json({
      message: "Course fetched successfully!!",
      availableCourses,
    });
  } catch (err) {
    // Handle any errors that occur during course creation
    return res.status(500).json({
      message: "Failed to fetch course",
      error: err.message,
    });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;

  await User.updateOne(
    {
      username: username,
    },
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  );
  res.status(200).json({
    message: "Purchase completed successfully!",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  try {
    // Access the username from the request object set by middleware
    const username = req.headers.username;

    // Find the user by username
    const userInfo = await User.findOne({ username: username });

    // Handle case where user is not found
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log purchased courses for debugging
    console.log(userInfo.purchasedCourses);

    // Fetch purchased courses from the Courses collection
    const userPurchasedCourses = await Course.find({
      _id: { $in: userInfo.purchasedCourses },
    });

    // Send the response with purchased courses
    res.status(200).json({
      message: "Here are your purchased courses!",
      userPurchasedCourses,
    });
  } catch (err) {
    // Log error for debugging
    console.error("Error fetching purchased courses:", err);

    // Send error response
    return res.status(500).json({
      message: "Failed to fetch purchased courses",
      error: err.message,
    });
  }
});

module.exports = router;
