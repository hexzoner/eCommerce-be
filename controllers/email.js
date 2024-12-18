import sgMail from "@sendgrid/mail";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const senderEmail = "teppalu@gmail.com";
const verificationTemplateId = "d-a273fa4d80c24bd0892dfd990430b3d7";
const url = process.env.VITE_URL;

export const sendEmail = async (req, res) => {
  const { email, subject, text, html } = req.body;

  if (!email || !subject || !text || !html) {
    throw new ErrorResponse("Email, subject, text and html are required", 400);
  }

  const msg = {
    to: email,
    from: senderEmail,
    subject: subject,
    text: text,
    html: html,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail
    .send(msg)
    .then(() => {
      res.json({
        message: "Email sent",
        data: msg,
      });
    })
    .catch((error) => {
      console.error(error);
      throw new ErrorResponse("Email not sent", 500);
    });

  //   res.json({ message: "Email sent" });
};

export const verificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ErrorResponse("Email is required", 400);

  const userExist = await User.findOne({ where: { email } });
  if (!userExist) throw new ErrorResponse("User not found", 404);

  const token = jwt.sign({ userId: userExist.id, purpose: "emailVerification" }, process.env.JWT_VERIFICATION_SECRET, { expiresIn: "24h" });

  const sendConfirmationEmail = (email, name, token) => {
    const msg = {
      to: email,
      from: senderEmail,
      templateId: verificationTemplateId,
      dynamicTemplateData: {
        name: name,
        link: `${url}confirm?token=${token}`,
      },
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail
      .send(msg)
      .then(() =>
        res.json({
          message: "Email sent",
          data: msg,
        })
      )
      .catch((error) => {
        console.error(error);
        throw new ErrorResponse("Email not sent", 500);
      });
  };

  sendConfirmationEmail(email, userExist.firstName, token);
};

// const msg = {
//   to: "test@example.com",
//   from: "test@example.com",
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };
