import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS, EMAIL_MAIN, CLIENT_DOMAINS } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
const sendEmail = async (toEmail: string, token: string, userName: string) => {
  const verificationUrl = `${
    CLIENT_DOMAINS?.split(",")[0]
  }/signup-process/verification/${token}`;
  const mailOptions = {
    from: EMAIL_MAIN,
    to: toEmail,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: htmlEmail(verificationUrl, userName),
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

const htmlEmail = (verificationUrl: string, userName: string) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="color: #555;">Dear ${userName},</p>
        <p style="color: #555;">Thank you for signing up to Airvilla website. Please verify your email by clicking the button below:</p>
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
