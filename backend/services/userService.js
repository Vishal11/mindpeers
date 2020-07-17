var { UserSchema } = require("./../model/user");
var { DoctorSchema } = require("./../model/doctor");
var { AppointmentSchema } = require("./../model/appointment");

var bcrypt = require("bcrypt");
const saltRounds = 10;

signupUser = function (user) {
  return new Promise((resolve, reject) => {
    if (user.userType == "doctor") {
      const doctorModel = new DoctorSchema(user);

      bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) {
          reject(err);
        }
        doctorModel.password = hash;
        doctorModel.save(function (err, data) {
          if (err) {
            reject(err);
          }
          resolve("success");
        });
      });
    } else {
      const userModel = new UserSchema(user);
      bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) {
          reject(err);
        }
        userModel.password = hash;
        userModel.save(function (err, data) {
          if (err) {
            reject(err);
          }
          resolve("success");
        });
      });
    }
  });
};

authenticateUser = function (user) {
  return new Promise((resolve, reject) => {
    if (user.userType == "doctor") {
      DoctorSchema.findOne({ email: user.email }, function (err, data) {
        if (err) {
          reject(err);
        }
        console.log(data);
        if (!!data) {
          bcrypt.compare(user.password, data.password, function (err, res) {
            if (err) {
              reject(err);
            }
            if (res) {
              delete data.password;
              resolve(data);
            } else {
              reject("Wrong Password !!");
            }
          });
        } else {
          reject("User not exist !!");
        }
      });
    } else {
      const userModel = new UserSchema(user);

      UserSchema.findOne({ email: user.email }, function (err, data) {
        if (err) {
          reject(err);
        }
        if (!!data) {
          bcrypt.compare(user.password, data.password, function (err, res) {
            if (err) {
              reject(err);
            }
            if (res) {
              delete data.password;
              resolve(data);
            } else {
              reject("Wrong Password !!");
            }
          });
        } else {
          reject("User not exist !!");
        }
      });
    }
  });
};

getAvailableDoctor = function (filter) {
  return new Promise((resolve, reject) => {
    let date = new Date(filter.date);
    let medIssue = filter.medIssue;
    DoctorSchema.find({}, "name email phone specialization", function (
      err,
      data
    ) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

bookAppointment = function (bookDetail) {
  return new Promise((resolve, reject) => {
    let userDetail = bookDetail.user;
    let doctorDetail = bookDetail.doctor;
    AppointmentSchema.findOneAndUpdate(
      { email: doctorDetail.email, name: doctorDetail.name, appointmentDate: bookDetail.date },
      { $addToSet: { pendingList: userDetail } },
      { new: true, upsert: true },
      function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

module.exports = {
  signupUser,
  authenticateUser,
  getAvailableDoctor,
  bookAppointment
};
