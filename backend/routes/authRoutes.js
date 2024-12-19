const express = require('express');
const User = require('../models/User');
const upload = require('../middlewares/upload');
const router = express.Router();

// Signup route
router.post('/signup', upload.single('profilePicture'), async (req, res) => {
  const { username, password } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  try {
    const newUser = new User({
      username,
      password,
      profilePicture
    });
    await newUser.save();
    res.json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login attempt:', username, password); // Log the login attempt
    const user = await User.findOne({ username });
    if (!user) {
      console.error('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful');
    res.json({
      message: 'Login successful!',
      user: {
        username: user.username,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
