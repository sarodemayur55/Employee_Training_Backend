const nodemailer = require('nodemailer');

const mailsender = (maillist, subject, body) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        // auth:{
        //     user:"sarodemayur55@outlook.com",
        //     pass:"Mayur@1310"
        // }
        // host: "smtp-mail.outlook.com", // hostname
         auth: {
            user: "mayursarodeca2018@gmail.com",
            pass: "fhzvawtpvbltwbuj"
        }
    });

    const options = {
        from: "mayursarodeca2018@gmail.com",
        to: maillist,
        subject: subject,
        text: body
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            return;
        }
    })
}
module.exports = mailsender