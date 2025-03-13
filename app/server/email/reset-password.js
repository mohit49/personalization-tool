
    const nodemailer = require('nodemailer');
    const fs = require('fs');
    const path = require('path');
    const jwt = require('jsonwebtoken');


    const bcrypt = require('bcryptjs');


    // Create a reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Godaddy', // Use your email provider
      auth: {
        user: 'info@simplifyscript.com',
        pass: 'mohit9313#', // Use a secure app-specific password
      },
    });

    
    // Function to read email template and replace placeholders
     // Generate the reset link
    
     const getEmailTemplate = (filePath, replacements) => {
       let template = fs.readFileSync(filePath, 'utf8');
       for (const key in replacements) {
         const regex = new RegExp(`{{${key}}}`, 'g');
         template = template.replace(regex, replacements[key]);
       }
       return template;
     };
    // Function to send account verification email
    const sendEmailNotification = async (user) => {

        const resetToken = jwt.sign(
            { userId: user._id },
            'your_jwt_secret', // Replace with your own secret key
            { expiresIn: '1h' } // Token expires in 1 hour
          );
            // Save the reset token and expiry to the database
            user.resetToken = resetToken;
            user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
            await user.save();
            const resetLink = `https://app.mazzl.ae/reset-password/${resetToken}`;

      const email = user?.email;
      // Get the email template and replace placeholders
      const templatePath = path.join(__dirname, 'templates', 'reset-password.html');
      const emailHtml = getEmailTemplate(templatePath, { email, resetLink });
    
      const mailOptions = {
        from: 'info@simplifyscript.com',
        to: user.email,
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
    

  
