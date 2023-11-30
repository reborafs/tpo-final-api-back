const Multer = require("multer");

//Config multer middleware
const storage = new Multer.memoryStorage();
const upload = Multer({
    storage,
});


module.exports = {
    upload
}