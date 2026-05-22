import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const   sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    await transporter.sendMail({
      from: `"Meeting Scheduler" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent");

  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;