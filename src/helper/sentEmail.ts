import nodemailer from 'nodemailer';
import { PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplate';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function sendResetPasswordLink(userEmail: string, resetPasswordURL: string) {
  const mailOptions = {
    from: `Swap Device Team <${process.env.EMAIL}>`,
    to: userEmail,
    subject: 'Reset Your Password',
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      '{resetURL}',
      resetPasswordURL
    ),
  };

  try {
    transporter.sendMail(mailOptions);
    console.log('Reset password URL has been sent');
  } catch (error) {
    console.error('Error sending reset password email:', error);
  }
}

export { sendResetPasswordLink };
