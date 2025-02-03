import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Add this to your .env file
    pass: process.env.GMAIL_APP_PASSWORD // Add this to your .env file
  }
});

const sendEmail = async (reportData) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'jrsdevelopment@hotmail.com',
    subject: `User Report - ${reportData.reported_username}`,
    text: `
      Reported User Information:
      Username: ${reportData.reported_username}
      Email: ${reportData.reported_email}
      
      Listing Information:
      Listing ID: ${reportData.listing_id}
      Listing Title: ${reportData.listing_title}
      
      Reporter Information:
      Name: ${reportData.reporter_name}
      Email: ${reportData.reporter_email}
      
      Report Details:
      Reason: ${reportData.report_reason}
      Additional Details: ${reportData.report_details}
    `
  };

  return transporter.sendMail(mailOptions);
};

router.post('/send-email', async (req, res) => {
  try {
    await sendEmail(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;