const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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
const sendEmailNotification = async (newUser, project) => {
  const projectName = project.projectName;
  const projectId= project._id;
  
  // Get the email template and replace placeholders
  const templatePath = path.join(__dirname, 'templates', 'user-added.html');
  const emailHtml = getEmailTemplate(templatePath, { newUser, projectName, projectId });

  const mailOptions = {
    from: 'info@simplifyscript.com',
    to: newUser,
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
    sendEmailNotification,
};
