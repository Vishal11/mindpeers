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
      bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) {
          reject(err);
        }
        let pwd = hash;
        DoctorSchema.findOne({ email: user.email }, function (err, data) {
          if (err) {
            reject(err);
          }
          console.log(data);
          if (!!data) {
            if (data.password == hash) {
              resolve("Successfull Login !!");
            } else {
              reject("Wrong Password !!");
            }
          } else {
            reject("User not exist !!");
          }
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

module.exports = {
  signupUser,
  authenticateUser,
  getAvailableDoctor
};
