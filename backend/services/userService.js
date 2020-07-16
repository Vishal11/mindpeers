var {UserSchema}= require('./../model/user');
var {DoctorSchema}= require('./../model/doctor');

var bcrypt = require('bcrypt');
const saltRounds = 10;


signupUser = function(user) {

    return new Promise((resolve, reject) => {

        if(user.userType == 'doctor') {
            const doctorModel = new DoctorSchema(user);

            bcrypt.hash(user.password, saltRounds, function(err, hash) {
                if(err) {
                    reject(err);
                }
                doctorModel.password = hash;
                doctorModel.save(function(err, data) {
                    if(err) {
                        reject(err);
                    }
                    resolve('success');
                });
            });
    
        } else {
            const userModel = new UserSchema(user);
            bcrypt.hash(user.password, saltRounds, function(err, hash) {
                if(err) {
                    reject(err);
                }
                userModel.password = hash;
                userModel.save(function(err, data) {
                    if(err) {
                        reject(err);
                    }
                    resolve('success');
                });
            });
    
        }
    })
    
}

module.exports ={
    signupUser
}