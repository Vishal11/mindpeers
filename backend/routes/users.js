var express = require("express");
var router = express.Router();
var userService = require("./../services/userService");

router.post('/signup', function (req, res, next) {
  userService
    .signupUser(req.body)
    .then((result) => {
      return res.json({success: true, message: "Account Created !!", data:null});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err.message,data:null });
    });
});

router.post('/login', function (req, res, next) {
  userService
    .authenticateUser(req.body)
    .then((result) => {
      return res.json({success: true, message: "Login Successfull !!", data:result});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err, data:null });
    });
});

router.get('/doctorlist', function (req, res, next) {
  userService
    .getAvailableDoctor(req.session)
    .then((data) => {
      return res.json({success: true, message: "Doctor List", data:data});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err, data:null });
    });
});


module.exports = router;
