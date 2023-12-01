// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/user.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query",query)
        var Users = await User.paginate(query, options)
        // Return the Userd list that was retured by the mongoose promise
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Users');
    }
}

// Async function to get the User List
exports.getUserById = async function (id) {
    console.log("ID TO BE FOUND: ", id)
    try {
        //Find the old User Object by the Id
        var foundUser = await User.findById(id);
        console.log (foundUser);
        return foundUser;
    } catch (e) {
        throw Error("Error occured while finding the User")
    }
}


exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    
    var newUser = new User({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        date: new Date(),
        password: hashedPassword,
        titulo: user.titulo,
        exp: user.exp,
        imgUrl: user.imgUrl,
        telefono: user.telefono,
        bio: user.bio,
    })

    try {
        // Saving the User 
        var savedUser = await newUser.save();
        var token = jwt.sign({
            id: savedUser._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating User")
    }
}

exports.updateUser = async function (user) {
    
    var id = user._id
    console.log(id)
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findById(id);
        console.log ("Found User: ", oldUser);
    } catch (e) {
        console.error(e);
        throw Error("Error occured while Finding the User");
    }
    // If no old User Object exists return false
    if (!oldUser) {
        console.log("user not found");
        return false;
    }
    //Edit the User Object
    console.log("Old user: ", oldUser);
    oldUser.name = user.name  ? user.name : oldUser.name;
    oldUser.lastName = user.lastName ? user.lastName : oldUser.lastName;
    oldUser.email = user.email ? user.email : oldUser.email;
    oldUser.password = user.password ? bcrypt.hashSync(user.password, 8) : oldUser.password;
    oldUser.imgUrl = user.imgUrl ? user.imgUrl : oldUser.imgUrl;
    oldUser.bio = user.bio ? user.bio : oldUser.bio;
    console.log("New user: ", oldUser);
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        console.error(e);
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {
    console.log(id)
    // Delete the User
    try {
        var deleted = await User.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}


exports.loginUser = async function (user) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        console.log("login:",user)
        var _details = await User.findOne({
            email: user.email
        });
        if  (_details == null) { throw Error("User not found.")}

        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) return 0;

        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return {token:token, user:_details};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.stack)
    }

}