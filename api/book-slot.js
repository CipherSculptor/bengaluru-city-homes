// Serverless function for Vercel
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Path for the all-bookings Excel file
const bookingsDir = path.join(os.tmpdir(), 'bookings');
const allBookingsFilePath = path.join(bookingsDir, 'all-bookings.xlsx');

// Simple function to create a new Excel file with headers
async function createNewExcelFile() {
  console.log("Creating new all-bookings.xlsx file");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("All Bookings");

  // Add headers
  worksheet.columns = [
    { header: "Booking ID", key: "id", width: 15 },
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Contact Number", key: "contactNumber", width: 15 },
    { header: "Property", key: "property", width: 25 },
    { header: "Visit Date", key: "visitDate", width: 15 },
    { header: "Time Slot", key: "timeSlot", width: 20 },
    { header: "Booking Time", key: "bookingTime", width: 20 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  return workbook;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const booking = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const bookingTime = new Date().toLocaleString();

    console.log("Received booking request for:", booking.apartment);
    console.log("Time slot selected:", booking.timeSlot);

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

    // Ensure the bookings directory exists
    if (!fs.existsSync(bookingsDir)) {
      fs.mkdirSync(bookingsDir, { recursive: true });
    }

    let workbook;

    // Check if the file exists
    if (fs.existsSync(allBookingsFilePath)) {
      try {
        // Try to open the existing file
        console.log("Opening existing all-bookings.xlsx file");
        workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(allBookingsFilePath);

        // Get the worksheet or create it if it doesn't exist
        let worksheet = workbook.getWorksheet("All Bookings");
        if (!worksheet) {
          console.log("Worksheet not found, creating a new one");
          // If the worksheet doesn't exist, create a new workbook
          workbook = await createNewExcelFile();
          worksheet = workbook.getWorksheet("All Bookings");
        }

        // Add the booking data
        const newRow = worksheet.addRow(bookingData);
        newRow.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });

        // Save the workbook
        await workbook.xlsx.writeFile(allBookingsFilePath);
        console.log("Booking added to existing file");
      } catch (error) {
        console.error("Error with existing file, creating new one:", error.message);
        // If there was an error, create a new file
        workbook = await createNewExcelFile();

        // Get the worksheet
        const worksheet = workbook.getWorksheet("All Bookings");

        // Add the booking data
        const newRow = worksheet.addRow(bookingData);
        newRow.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });

        // Save the workbook
        await workbook.xlsx.writeFile(allBookingsFilePath);
        console.log("Created new file and added booking");
      }
    } else {
      // File doesn't exist, create a new one
      workbook = await createNewExcelFile();

      // Get the worksheet
      const worksheet = workbook.getWorksheet("All Bookings");

      // Add the booking data
      const newRow = worksheet.addRow(bookingData);
      newRow.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });

      // Save the workbook
      await workbook.xlsx.writeFile(allBookingsFilePath);
      console.log("Created new file and added booking");
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Slot booked successfully",
      emailSent: false
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    res.status(500).json({ success: false, message: "Error processing booking" });
  }
};
