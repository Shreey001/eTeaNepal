const nodemailer = require("nodemailer");

const sendEmail = (email,subject,message) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'alexandrea.feest3@ethereal.email',
        pass: '5UpXvzAhQQPjjG3NEQ'
    },
  });

  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"E-Tea Nepal" <alexandrea.feest3@ethereal.email>', // sender address
      to: email, // list of receivers
      subject, // Subject line
      text: message, // plain text body
      html: `<b>${message}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
};

module.exports = sendEmail;