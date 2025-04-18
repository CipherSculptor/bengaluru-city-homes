// Serverless function for Vercel deployment
// This file will be automatically detected by Vercel and deployed as an API endpoint

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the booking data from the request body
    const booking = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const bookingTime = new Date().toLocaleString();

    console.log('Received booking request for:', booking.apartment);
    console.log('Time slot selected:', booking.timeSlot);

    // Create booking data object
    const bookingData = {
      id: timestamp,
      name: booking.name,
      email: booking.email,
      contactNumber: booking.contactNumber,
      property: booking.apartment,
      visitDate: booking.visitDate,
      timeSlot: booking.timeSlot,
      bookingTime: bookingTime,
    };

    // Return a success response
    // In a real implementation, you would save this data to a database
    return res.status(200).json({
      success: true,
      message: 'Booking received successfully',
      booking: bookingData,
      emailSent: false // We're not sending emails in this serverless function
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing booking',
      error: error.message
    });
  }
};
