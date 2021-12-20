const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("user", userSchema);

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const hasedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hasedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: "sign up successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Something Went wrong!, Sign up failed",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          access_token: token,
          message: "Login successfully",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed!",
      });
    }
  } catch (error) {
      console.log(error);
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
});

module.exports = router;
