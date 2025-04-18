const nodemailer = require("nodemailer");

// Create a test account for development
// In production, you would use actual SMTP credentials
const createTransporter = async () => {
  // For development/testing, we'll use Ethereal (fake SMTP service)
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return { transporter, testAccount };
};

// Function to send booking confirmation email
const sendBookingConfirmation = async (bookingData) => {
  try {
    const { transporter, testAccount } = await createTransporter();

    // Format the date and time for better readability
    const formattedDate = new Date(bookingData.date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Create email content
    const mailOptions = {
      from: '"Bengaluru City Homes" <info@bengalurucityhomes.com>',
      to: bookingData.email,
      subject: "Your Site Visit Booking Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0c3b69;">Booking Confirmation</h1>
            <p style="font-size: 18px; color: #333;">Your site visit has been successfully scheduled!</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #0c3b69; margin-top: 0;">Booking Details</h2>
            <p><strong>Property:</strong> ${bookingData.property}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Contact:</strong> ${bookingData.contactNumber}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>Thank you for choosing Bengaluru City Homes. We look forward to meeting you!</p>
            <p>If you need to reschedule or have any questions, please contact us at <a href="mailto:support@bengalurucityhomes.com">support@bengalurucityhomes.com</a> or call us at +91 9876543210.</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
            <p>© 2023 Bengaluru City Homes. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Booking confirmation email sent successfully");
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendBookingConfirmation,
};
