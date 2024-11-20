import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS, EMAIL_MAIN, CLIENT_DOMAINS } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendInvitationEmail = async (
  email: string,
  token: string,
  memberInfo: any
) => {
  const invitationUrl = `${CLIENT_DOMAINS}/accept-invitation?token=${token}`;
  const mailOptions = {
    from: EMAIL_MAIN,
    to: email,
    subject: "Invitation to Join the Airvilla Community",
    text: `You're invited to join Airvilla. Please click the link below to accept your invitation.`,
    html: htmlEmail(invitationUrl, memberInfo),
  };

  await transporter.sendMail(mailOptions);
};

const htmlEmail = (invitationUrl: string, memberInfo: any) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; color: #333;">
        <h2 style="color: #333; text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to Airvilla!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear <strong style="color: #4CAF50;">${memberInfo.firstName} ${memberInfo.lastName}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          We are pleased to invite you to join the Airvilla platform, where you can connect and enjoy exclusive member benefits. To accept this invitation, simply click the button below.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          <strong>Note:</strong> This invitation link will expire in <strong>7 days</strong>.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${invitationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #555;">
          Alternatively, you can use the following details to access your account:
        </p>
        <div style="font-size: 14px; line-height: 1.6; color: #555; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <strong>Email:</strong> ${memberInfo.email} <br>
          <strong>Temporary Password:</strong> ${memberInfo.password}<br>
          <strong>Role:</strong> ${memberInfo.role}<br>
          <strong>Department:</strong> ${memberInfo.department} 
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #555; margin-top: 20px;">
          If you’re unable to use the button, please copy and paste the following link into your browser:
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #4CAF50; word-break: break-all;">
          <a href="${invitationUrl}" style="color: #4CAF50; text-decoration: none;">${invitationUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 14px; line-height: 1.6; color: #555;">
          We look forward to welcoming you onboard. Should you have any questions, please don’t hesitate to reach out.
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 20px;">
          Best Regards, <br>
          <strong>Airvilla Team</strong>
        </p>
      </div>
    `;
};
