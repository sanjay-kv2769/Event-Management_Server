const express = require('express');
const loginDB = require('../models/loginSchema');
const loginRoutes = express.Router();
const bcrypt = require('bcryptjs');

loginRoutes.post('/', async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.email && req.body.password) {
      const oldUser = await loginDB.findOne({
        email: req.body.email,
      });
      if (!oldUser) {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: "User don't exist, Register First",
        });
      }
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        oldUser.password
      );
      if (!isPasswordCorrect) {
        return res.json({
          Success: false,
          Error: true,
          Message: 'Password Incorrect',
        });
      }

      return res.status(200).json({
        success: true,
        error: false,
        message: 'Login Successful',
        role: oldUser.role,
        login_id: oldUser._id,
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'All field are required',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

module.exports = loginRoutes;
