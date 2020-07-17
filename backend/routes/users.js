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

router.post('/doctorlist', function (req, res, next) {
  userService
    .getAvailableDoctor(req.body)
    .then((data) => {
      return res.json({success: true, message: "Doctor List", data:data});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err, data:null });
    });
});

router.post('/appointments', function (req, res, next) {
  userService
    .bookAppointment(req.body)
    .then((data) => {
      return res.json({success: true, message: "Appointment Booked", data:data});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err, data:null });
    });
});

router.post('/appointmentslist', function (req, res, next) {
  userService
    .getAppointmentDetails(req.body)
    .then((data) => {
      return res.json({success: true, message: "Appointment List", data:data});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err, data:null });
    });
});

router.put('/appointments/:id', function (req, res, next) {
  userService
    .approveAppointment(req.params.id, req.body)
    .then((data) => {
      return res.json({success: true, message: "Appointment Approved", data:data});
    })
    .catch((err) => {
      return res.status(400).json({success:false, message: err, data:null });
    });
});


module.exports = router;
