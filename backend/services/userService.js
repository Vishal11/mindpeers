var UserSchemaModel= require('./../model/user');

signupUser = function(user) {

    return new Promise((resolve, reject) => {

        const userModel = new UserSchemaModel(user);

       userModel.save(function(err, data) {
            if(err) {
                reject(err);
            }
            resolve('success');
        });

    })
    
}

module.exports ={
    signupUser
}