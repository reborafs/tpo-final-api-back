const nodemailer = require("nodemailer");

/*
// LIMITE DE 100 MAILS POR DIA.
const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });
*/


// DEV TEST
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ETHEREAL_EMAIL,
    pass: process.env.ETHEREAL_EMAIL_PASSWORD,
  },
});



const sendMail = async (email) => {
  let result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email.to,
      subject: email.subject,
      text: email.text, 
      html: email.html,
  });
  return result;
}

module.exports = sendMail;