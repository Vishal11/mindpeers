var express = require("express");
var router = express.Router();
var userService = require("./../services/userService");

/* GET users listing. */
router.post('/signup', function (req, res, next) {
  userService
    .signupUser(req.body)
    .then((result) => {
      res.json({success: true, message: "Account Created !!", data:null});
    })
    .catch((err) => {
      return res.status(400).json({ message: err.message });
    });
});

module.exports = router;
