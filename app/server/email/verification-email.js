const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const fs = require('fs');

const path = require('path');
//const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Default to development

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Godaddy', // Use your email provider
  auth: {
    user: 'info@simplifyscript.com',
    pass: 'mohit9313#', // Use a secure app-specific password
  },
});

// Function to read email template and replace placeholders
const getEmailTemplate = (filePath, replacements) => {
  let template = fs.readFileSync(filePath, 'utf8');
  for (const key in replacements) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, replacements[key]);
  }
  return template;
};

// Function to send account verification email
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/verify/${verificationToken}`;
  
  // Get the email template and replace placeholders
  const templatePath = path.join(__dirname, 'templates', 'verify-email.html');
  const emailHtml = getEmailTemplate(templatePath, { verificationLink });

  const mailOptions = {
    from: 'info@simplifyscript.com',
    to: email,
    subject: 'Account Verification',
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendVerificationEmail,
};
