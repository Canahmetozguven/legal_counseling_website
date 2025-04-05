const mongoose = require("mongoose");
const User = require("../models/userModel");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../config.env") });

const createUser = async (name, email, password, role) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      role,
    });

    console.log("User created successfully:", user);
    process.exit();
  } catch (err) {
    console.error("Error creating user:", err);
    process.exit(1);
  }
};

if (process.argv.length < 6) {
  console.error("Usage: node createUser.js <name> <email> <password> <role>");
  process.exit(1);
}

const [name, email, password, role] = process.argv.slice(2);
createUser(name, email, password, role);
