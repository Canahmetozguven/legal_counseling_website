const mongoose = require('mongoose');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

const createUser = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      role: 'admin',
    });

    console.log('User created successfully:', user);
    process.exit();
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
};

createUser();