const mongoose = require("mongoose");
const User = require("../models/userModel");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../config.env") });

const testUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Test Lawyer",
    email: "lawyer@example.com",
    password: "lawyer123",
    role: "lawyer",
  },
  {
    name: "Test Secretary",
    email: "secretary@example.com",
    password: "secretary123",
    role: "secretary",
  },
];

const initializeUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create({
          ...userData,
          passwordConfirm: userData.password,
        });
        console.log(`Created user: ${user.name} (${user.role})`);
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }
    console.log("User initialization completed");
  } catch (err) {
    console.error("Error initializing users:", err);
  } finally {
    await mongoose.connection.close();
  }
};

initializeUsers();
