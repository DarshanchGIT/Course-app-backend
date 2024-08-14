const { Admin } = require("../db/index");
// Middleware for handling auth
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const username = req.headers.username;
  const password = req.headers.password;

  //just basic check goes here
  if (!username || !password)
    return res.status(400).json({ message: "Username and Password required" });

  // checking if user exist or not in database ?

  Admin.findOne({
    username: username,
    password: password,
  })
    .then((result) => {
      if (result) {
        //call the next middleware
        next();
      } else {
        //when there' no such Admin exist
        res.status(400).json({
          message: "Admin doesn't exist in Database, Honey !!",
        });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Error accessing the database", error: err });
    });
}

module.exports = adminMiddleware;
