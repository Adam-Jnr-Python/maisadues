const mongoose = require("mongoose");
const Student = require("../models/Students");
const Dues = require("../models/Dues");
const Admin = require("../models/Admin");
require("dotenv").config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find first admin (or create a default one)
    let admin = await Admin.findOne();
    if (!admin) {
      console.log("No admin found. Creating default admin...");
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      admin = new Admin({
        name: "System Admin",
        email: "admin@system.com",
        password: hashedPassword,
        role: "superadmin",
      });
      await admin.save();
      console.log("Default admin created:", admin.email);
    }

    console.log(`Using admin: ${admin.email} (${admin._id})`);

    // Update all students without adminId
    const studentResult = await Student.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: admin._id } }
    );
    console.log(`✅ Updated ${studentResult.modifiedCount} students`);

    // Update all dues without adminId
    const duesResult = await Dues.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: admin._id } }
    );
    console.log(`✅ Updated ${duesResult.modifiedCount} dues records`);

    console.log("🎉 Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrate();