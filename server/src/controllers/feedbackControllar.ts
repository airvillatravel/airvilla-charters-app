import axios from "axios";
import { AuthRequest } from "../utils/definitions";
import { Response } from "express";
import getAffiliateAccess from "../utils/access-check/getAffiliateAccess";
import nodemailer from "nodemailer";

const {
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_MAIN,
  CUSTOMER_SUPPORT_EMAIL,
  TECHNICAL_SUPPORT_EMAIL,
  SALES_EMAIL,
  BILLING_AND_PAYMENTS_EMAIL,
  OPERATIONS_EMAIL,
} = process.env;

const categories = [
  {
    cat: "bug",
    name: "bug report",
  },
  {
    cat: "feature",
    name: "feature request",
  },
  {
    cat: "general",
    name: "general feedback",
  },
];

const departments = [
  {
    name: "customer support",
    email: CUSTOMER_SUPPORT_EMAIL,
  },
  {
    name: "technical support",
    email: TECHNICAL_SUPPORT_EMAIL,
  },
  {
    name: "sales",
    email: SALES_EMAIL,
  },
  {
    name: "billing and payments",
    email: BILLING_AND_PAYMENTS_EMAIL,
  },
  {
    name: "operations",
    email: OPERATIONS_EMAIL,
  },
  {
    name: "other",
    email: EMAIL_MAIN,
  },
];

/**
 * Handles the submission of feedback from an authenticated user.
 * Sends the feedback data to a Google Apps Script web app for storage.
 *
 * @param {AuthRequest} req - The request object containing the user's authentication information and the feedback data.
 * @param {Response} res - The response object used to send the feedback submission result.
 * @returns {Promise<Response>} - A promise that resolves to the response object containing the feedback submission result.
 */
export const submitFeedback = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  // Extract the feedback data from the request body
  const { subject, description, category, customFields, files } = req.body;

  try {
    // Get the authenticated user
    const user = await getAffiliateAccess(req, res);

    // Prepare the data to be sent to the Google Apps Script web app
    const data = {
      user: `${(user as { firstName: string; lastName: string }).firstName} ${
        (user as { firstName: string; lastName: string }).lastName
      }`, // Combine the first and last name of the user
      email: (user as { email: string }).email,
      subject,
      description,
      category,
      customFields,
      files: req.files,
      date: new Date(),
    };

    // Send the data to email
    await sendEmail(data);

    // Respond with the status and result from the Google Apps Script web app
    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    // Log any error that occurs and return an error response
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// EMAIL FUNCTION HANDLER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
const sendEmail = async (data: any) => {
  const customFields = JSON.parse(data.customFields);
  const category = categories.find((d) => d.cat === data.category)?.name;
  data = { ...data, category, customFields };
  try {
    // Prepare attachments
    const attachments =
      data.files && Array.isArray(data.files)
        ? data.files.map((file: any) => {
            return {
              filename: file.originalname,
              content: file.buffer,
              encoding: "base64",
              mimetype: file.mimetype,
            };
          })
        : []; // No attachments if data.files is not present or not an array

    const depEmail =
      data.customFields &&
      departments.find(
        (d) =>
          d.name?.toLowerCase() === data.customFields.department?.toLowerCase()
      )?.email;

    const mailOptions = {
      from: EMAIL_MAIN,
      to: depEmail || EMAIL_MAIN,
      subject: `Support Request: ${data.category}`,
      html: htmlEmail(data),
      attachments,
    };

    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// HTML email content based on the feedback data
const htmlEmail = (data: any) => {
  // Generate custom fields HTML
  const customFieldsHtml = data.customFields
    ? Object.entries(data.customFields)
        .map(
          ([key, value]) => `
          <tr>
            <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;"><strong>${key}:</strong></td>
            <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${value}</td>
          </tr>`
        )
        .join("")
    : "";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">New Ticket Submission</h2>
      <p style="color: #555;">A new ticket has been submitted by <strong>${
        data.user
      }</strong> (<a href="mailto:${data.email}">${
    data.email
  }</a>) on <strong>${new Date(data.date).toLocaleString()}</strong>.</p>
      <h3 style="color: #333;">Feedback Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;"><strong>Category:</strong></td>
          <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${
            data.category
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;"><strong>Subject:</strong></td>
          <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${
            data.subject
          }</td>
        </tr>
        ${customFieldsHtml}
         <tr>
          <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
          <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${
            data.description
          }</td>
        </tr>
      </table>
    
      <p style="color: #555;">Best regards,</p>
      <p style="color: #555;">Support Team</p>
    </div>
  `;
};
