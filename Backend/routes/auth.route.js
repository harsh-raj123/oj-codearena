const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!(firstName && lastName && email && password)) {
    console.log(req.body);
    return res.status(400).send("enter all the information");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("usewr already exists");
    return res.status(400).send("User already exists with the same email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
  user.token = token;
  user.password = undefined;

  res.status(200).json({ message: 'you have been successfully registered', user });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("email and password are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("user not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid Password");
    }

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    user.token = token;
    user.password = undefined;

    res.status(200).json({ message: "login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
