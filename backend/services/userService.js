var { UserSchema } = require("./../model/user");
var { DoctorSchema } = require("./../model/doctor");

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
              resolve("Successfull Login !!");
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
              resolve("Successfull Login !!");
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

getAvailableDoctor = function (user) {
  return new Promise((resolve, reject) => {
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

// bookAppointment = function (user) {
//   return new Promise((resolve, reject) => {
//     DoctorSchema.find({}, "name email phone specialization", function (
//       err,
//       data
//     ) {
//       if (err) {
//         reject(err);
//       }
//       resolve(data);
//     });
//   });
// };

module.exports = {
  signupUser,
  authenticateUser,
  getAvailableDoctor,
};
