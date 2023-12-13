const { response } = require('express');
var UserService = require('../services/user.service');
const cloudinary = require("cloudinary").v2;
const transporter = require('../helpers/mailer');

//Config image server
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    });

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
const getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

const getUsersByMail = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro= {email: req.body.email}
    console.log(filtro)
    try {
        var Users = await UserService.getUsers(filtro, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

const getUserById = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    const { id } = req.params;
    try {
        var Users = await UserService.getUserById(id)
        return res.status(200).json({status: 200, data: Users, message: "Succesfully retrieved user by id."});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}


const createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var User = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        titulo: req.body.titulo ? req.body.titulo : null,
        exp: req.body.exp ? req.body.exp : null,
        imgUrl: req.body.imgUrl ? req.body.imgUrl : null,
        telefono: req.body.telefono ? req.body.telefono : null,
        bio: req.body.bio ? req.body.bio : null,
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({createdUser, message: "Succesfully created user"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "User creation was unsuccesfull"})
    }
}

const updateUser = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.id) {
        return res.status(400).json({status: 400., message: "ID must be present"})
    }

    var User = {
        _id: req.body.id,
        name: req.body.name ? req.body.name : null,
        lastName:  req.body.lastName ? req.body.lastName : null,
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null,
        titulo: req.body.titulo ? req.body.titulo : null,
        exp: req.body.exp ? req.body.exp : null,
        imgUrl: req.body.imgUrl ? req.body.imgUrl : null,
        telefono: req.body.telefono ? req.body.telefono : null,
        bio: req.body.bio ? req.body.bio : null,
    }
    console.log("User to Update: ", User);

    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(200).json({status: 200, data: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        console.error(e);
        return res.status(400).json({status: 400., message: e.message})
    }
}

const removeUser = async function (req, res, next) {

    var id = req.body.id;
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}


const loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("body",req.body)
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);
        if (loginUser===0)
            return res.status(401).json({status: 401, message: "Invalid username or password."})
        else
            return res.status(200).json({loginUser, message: "Succesfully login."})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e.stack);
        return res.status(400).json({status: 400, message: "Invalid username or password."})
    }
}


async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

const uploadImage = async function (req, res, next) {
    try {
        // Upload Image
        console.log("Uploading profile image...")
        console.log("body",req.body)
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        console.log("cldRes", cldRes)
        let data = res.json(cldRes);       
        return data;
      } catch (e) {
        console.log(e.stack);
        return res.status(400).json({status: 400, message: "Error while uploading."})
    }
}



const sendResetPasswordMail = async (email) => {
    console.log("INTENTO REQ MAIL")
    let result = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Recuperar Contraseña",
        text: "Here's your link: localhost", // plain text body
        html: "<b>Thank you!</b>",
    });
    console.log("result", { result });
    // TODO: Manejo de error de mail service
    return result;

}

const resetPassword = async function (req, res, next) {
    let page = req.query.page ? req.query.page : 1
    let limit = req.query.limit ? req.query.limit : 1;
    let filtro = {email: req.body.email};
    console.log(page)
    console.log(limit)
    console.log(filtro)
    try {
        console.log("getUsersByMail")
        let response = await UserService.getUsers(filtro, page, limit)
        console.log("getUsersByMail END")
        if (response.total == 0) {
            return res.status(400).json({status: 400, message: "No existe usuario con el mail "+ req.body.email});
        } else {
            console.log("Recovering password: ", req.body.email);
            let response = await sendResetPasswordMail(req.body.email);
            return res.status(200).json({status: 200, ok: true, message: "Reinicio de contraseña enviado a "+ req.body.email});
        }
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}


module.exports = {
    getUsers,
    getUsersByMail,
    getUserById,
    createUser,
    updateUser,
    removeUser,
    loginUser,
    uploadImage,
    resetPassword
}