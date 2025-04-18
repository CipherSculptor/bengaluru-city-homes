const express = require("express");
const cors = require("cors");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { sendBookingConfirmation } = require("./utils/emailService");

const app = express();

// Configure CORS to allow requests from your Vercel domain
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://bengaluru-city-homes.vercel.app",
      "https://bengaluru-city-homes-ciphersculptors-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Add health check endpoint
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Add booking status endpoint
app.get("/api/booking-status", (_, res) => {
  res.json({ status: "ok", message: "Booking server is available" });
});

// Ensure the bookings directory exists
const bookingsDir = path.join(__dirname, "bookings");
if (!fs.existsSync(bookingsDir)) {
  fs.mkdirSync(bookingsDir);
}

// Path for the all-bookings Excel file
const allBookingsFilePath = path.join(bookingsDir, "all-bookings.xlsx");

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
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A4F7D" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Save the workbook
  await workbook.xlsx.writeFile(allBookingsFilePath);
  return workbook;
}

app.post("/api/book-slot", async (req, res) => {
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

        // Get the current number of rows
        const currentRows = worksheet.rowCount;
        console.log(`Current number of rows in Excel: ${currentRows}`);

        // Force a complete rewrite of the file to ensure data is saved
        // First, collect all existing data
        const existingData = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber > 1) {
            // Skip header row
            const rowData = {
              id: row.getCell(1).value,
              name: row.getCell(2).value,
              email: row.getCell(3).value,
              contactNumber: row.getCell(4).value,
              property: row.getCell(5).value,
              visitDate: row.getCell(6).value,
              timeSlot: row.getCell(7).value,
              bookingTime: row.getCell(8).value,
            };
            existingData.push(rowData);
          }
        });

        // Add the new booking data
        existingData.push(bookingData);
        console.log(`Total bookings to save: ${existingData.length}`);

        // Create a new workbook
        const newWorkbook = await createNewExcelFile();
        const newWorksheet = newWorkbook.getWorksheet("All Bookings");

        // Add all data to the new workbook
        for (const data of existingData) {
          const newRow = newWorksheet.addRow(data);
          newRow.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          });
        }

        // Save the workbook
        await newWorkbook.xlsx.writeFile(allBookingsFilePath);
        console.log(
          `All ${existingData.length} bookings saved to all-bookings.xlsx`
        );

        // Verify the file was saved correctly
        const verifyWorkbook = new ExcelJS.Workbook();
        await verifyWorkbook.xlsx.readFile(allBookingsFilePath);
        const verifySheet = verifyWorkbook.getWorksheet("All Bookings");
        console.log(
          `Verification: Excel file now has ${verifySheet.rowCount} rows (including header)`
        );
      } catch (error) {
        console.error(
          "Error with existing file, creating new one:",
          error.message
        );
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

        // Verify the file was saved correctly
        const verifyWorkbook = new ExcelJS.Workbook();
        await verifyWorkbook.xlsx.readFile(allBookingsFilePath);
        const verifySheet = verifyWorkbook.getWorksheet("All Bookings");
        console.log(
          `Verification: Excel file now has ${verifySheet.rowCount} rows (including header)`
        );
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

      // Verify the file was saved correctly
      const verifyWorkbook = new ExcelJS.Workbook();
      await verifyWorkbook.xlsx.readFile(allBookingsFilePath);
      const verifySheet = verifyWorkbook.getWorksheet("All Bookings");
      console.log(
        `Verification: Excel file now has ${verifySheet.rowCount} rows (including header)`
      );
    }

    // Send confirmation email
    try {
      const emailResult = await sendBookingConfirmation({
        email: booking.email,
        name: booking.name,
        property: booking.apartment,
        date: booking.visitDate,
        time: booking.timeSlot,
        contactNumber: booking.contactNumber,
      });

      console.log(
        "Email confirmation status:",
        emailResult.success ? "Sent" : "Failed"
      );
      if (emailResult.previewUrl) {
        console.log("Email preview URL:", emailResult.previewUrl);
      }

      res.json({
        success: true,
        message: "Slot booked successfully",
        emailSent: emailResult.success,
        emailPreviewUrl: emailResult.previewUrl || null,
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      res.json({
        success: true,
        message: "Slot booked successfully but email confirmation failed",
        emailSent: false,
      });
    }
  } catch (error) {
    console.error("Error processing booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing booking" });
  }
});

// Endpoint to get all bookings (for admin/owner use)
app.get("/api/all-bookings", async (_, res) => {
  try {
    // Check if the file exists
    if (!fs.existsSync(allBookingsFilePath)) {
      return res.json({ success: true, bookings: [] });
    }

    // Read the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(allBookingsFilePath);

    // Get the worksheet
    const worksheet = workbook.getWorksheet("All Bookings");
    if (!worksheet) {
      return res.json({ success: true, bookings: [] });
    }

    // Convert worksheet data to JSON
    const bookings = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      // Skip header row
      if (rowNumber > 1) {
        const booking = {
          id: row.getCell(1).value,
          name: row.getCell(2).value,
          email: row.getCell(3).value,
          contactNumber: row.getCell(4).value,
          property: row.getCell(5).value,
          visitDate: row.getCell(6).value,
          timeSlot: row.getCell(7).value,
          bookingTime: row.getCell(8).value,
        };
        bookings.push(booking);
      }
    });

    console.log(`Retrieved ${bookings.length} bookings from Excel file`);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error retrieving all bookings:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving bookings" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
