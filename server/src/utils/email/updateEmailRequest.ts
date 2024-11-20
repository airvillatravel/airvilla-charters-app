import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS, EMAIL_MAIN, CLIENT_DOMAINS, SERVER_DOMAIN } =
  process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
const updateEmailRequest = async (
  email: string,
  newEmail: string,
  token: string,
  userName: string
) => {
  const verificationUrl = `${
    CLIENT_DOMAINS?.split(",")[0]
  }/account-hub/verify/${token}`;
  const mailOptions = {
    from: EMAIL_MAIN,
    to: newEmail,
    subject: "Update Email Request",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: htmlEmail(verificationUrl, userName, email, newEmail),
  };

  await transporter.sendMail(mailOptions);
};

const htmlEmail = (
  verificationUrl: string,
  userName: string,
  email: string,
  newEmail: string
) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Update Email Request</h2>
        <p style="color: #555;">Dear ${userName},</p>
        <p style="color: #555;">CLick to verify button to update your email from ${email} to ${newEmail}</p>
        <p style="color: #555;">The verification link expires after 10 mins</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
        <p style="color: #555;">If the button above does not work, please copy and paste the following link into your browser:</p>
        <p style="color: #555;"><a href="${verificationUrl}" style="color: #4CAF50;">${verificationUrl}</a></p>
        <p style="color: #555;">Best regards,</p>
        <p style="color: #555;">Airvilla Team</p>
      </div>
    `;
};

export default updateEmailRequest;
