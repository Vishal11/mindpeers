var {UserSchema}= require('./../model/user');
var bcrypt = require('bcrypt');
const saltRounds = 10;


signupUser = function(user) {

    return new Promise((resolve, reject) => {

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

    })
    
}

module.exports ={
    signupUser
}