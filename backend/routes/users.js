var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var userService = require("./../services/userService");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(
      null,
      "certificate_" + Math.round(Math.random() * 1000) + "_" + Date.now() + ext
    );
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/signup", function (req, res, next) {
  // console.log(req)

  if (req.body.userType == "doctor") {
    upload(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: err.message, data: null });
      }
      req.body.filePath = res.req.file.filename;

      userService
        .signupUser(req.body)
        .then((result) => {
          return res.json({
            success: true,
            message: "Account Created !!",
            data: result,
          });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ success: false, message: err.message, data: null });
        });
    });
  } else {
    userService
      .signupUser(req.body)
      .then((result) => {
        return res.json({
          success: true,
          message: "Account Created !!",
          data: result,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ success: false, message: err.message, data: null });
      });
  }
});

router.post("/login", function (req, res, next) {
  userService
    .authenticateUser(req.body)
    .then((result) => {
      return res.json({
        success: true,
        message: "Login Successfull !!",
        data: result,
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err, data: null });
    });
});

router.post("/doctorlist", verifyTokenFunc, function (req, res, next) {
  userService
    .getAvailableDoctor(req.body)
    .then((data) => {
      return res.json({ success: true, message: "Doctor List", data: data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err, data: null });
    });
});

router.post("/appointments", verifyTokenFunc, function (req, res, next) {
  userService
    .bookAppointment(req.body)
    .then((data) => {
      return res.json({
        success: true,
        message: "Appointment Booked",
        data: data,
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err, data: null });
    });
});

router.post("/appointmentslist", verifyTokenFunc, function (req, res, next) {
  userService
    .getAppointmentDetails(req.body)
    .then((data) => {
      return res.json({
        success: true,
        message: "Appointment List",
        data: data,
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err, data: null });
    });
});

router.put("/appointments/:id", verifyTokenFunc, function (req, res, next) {
  userService
    .approveAppointment(req.params.id, req.body)
    .then((data) => {
      return res.json({
        success: true,
        message: "Appointment Approved",
        data: data,
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err, data: null });
    });
});

function verifyTokenFunc(req, res, next) {
  const header = req.headers["authorization"];
  const accessToken = header && header.split(" ")[1];
  if (accessToken == null) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

module.exports = router;
