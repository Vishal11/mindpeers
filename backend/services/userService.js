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
    let dateFilter = {};
    dateFilter["appointmentDate"] = {
      $gte: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    };
    DoctorSchema.aggregate(
      [
        {
          $match: { $text: { $search: medIssue } },
        },
        {
          $lookup: {
            from: "appointment",
            let: { doctor_email: "$email" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$email", "$$doctor_email"] },
                        dateFilter,
                    ],
                  },
                },
              },
              {
                $addFields: {
                  availability: {
                    $cond: {
                      if: {
                        $or: [
                          {
                            $approvedList: { $exist: false },
                          },
                          {
                            $and: [
                              {
                                $approvedList: { $exist: true },
                              },
                              {
                                $lte: [{ $size: "$approvedList" }, 3],
                              },
                            ],
                          },
                        ],
                      },
                      then : true,
                      else : false
                    },
                  },
                },
              },
              { $project: { _id: 0, availability:1 } },
            ],
            as: "appointmentAvailibilty",
          },
        },
        {
          $unwind: appointmentAvailibilty
        },
        {
          $project: {
            name: 1,
            email: 1,
            specialization: 1,
            phone: 1,
            city: 1,
            availability:1
          },
        },
      ],
      function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

bookAppointment = function (bookDetail) {
  return new Promise((resolve, reject) => {
    let userDetail = bookDetail.user;
    userDetail["date"] = bookDetail.date;
    let doctorDetail = bookDetail.doctor;
    doctorDetail["date"] = bookDetail.date;
    AppointmentSchema.findOneAndUpdate(
      {
        email: doctorDetail.email,
        name: doctorDetail.name,
        appointmentDate: bookDetail.date,
      },
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

getAppointmentDetails = function (doctor) {
  return new Promise((resolve, reject) => {
    let filter = {};
    filter["name"] = doctor.name;
    filter["email"] = doctor.email;
    filter["appointmentDate"] = {
      $gte: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    };
    AppointmentSchema.find(filter, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

approveAppointment = function (id, user) {
  return new Promise((resolve, reject) => {
    AppointmentSchema.update(
      { _id: id },
      {
        $pull: { pendingList: { name: user.name, email: user.email } },
        $push: { approvedList: user },
      },
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
  bookAppointment,
  getAppointmentDetails,
  approveAppointment,
};
