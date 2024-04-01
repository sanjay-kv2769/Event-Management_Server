const express = require('express');
const loginDB = require('../models/loginSchema');
const registerDB = require('../models/registerSchema');
const registerRoutes = express.Router();
const bcrypt = require('bcryptjs');
const staffDB = require('../models/staffSchema');
const physicianDB = require('../models/physicianSchema');

//User Registration
registerRoutes.post('/user', async (req, res) => {
  try {
    const oldUser = await loginDB.findOne({ email: req.body.email });
    if (oldUser) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Email already exist, Please Log In',
      });
    }
    const oldPhone = await registerDB.findOne({ phone: req.body.phone });
    if (oldPhone) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Phone already exist',
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    let log = {
      email: req.body.email,
      password: hashedPassword,
      role: 2,
    };
    const result = await loginDB(log).save();
    let reg = {
      login_id: result._id,
      name: req.body.name,
      phone: req.body.phone,
    };
    const result2 = await registerDB(reg).save();

    if (result2) {
      return res.json({
        Success: true,
        Error: false,
        logdata: result2,
        regdata: result,
        Message: 'Registration Successful',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Registration Failed',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
    });
  }
});

//Staff Registration
registerRoutes.post('/staff', async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body);
    const oldStaff = await loginDB.findOne({ email: req.body.email });
    if (oldStaff) {
      // return res.status(400).json({
      //   Success: false,
      //   Error: true,
      //   Message: 'Email already exist, Please Log In',
      // });
      const data = {
        Success: false,
        Error: true,
        Message: 'Email already exist',
      };
      return res.render('add-staff', { data });
    }
    const oldStaffPhone = await staffDB.findOne({ phone: req.body.phone });
    if (oldStaffPhone) {
      
      // return res.status(400).json({
      //   Success: false,
      //   Error: true,
      //   Message: 'Phone already exist',
      // });

      const data = {
        Success: false,
        Error: true,
        Message: 'Phone already exist',
      };
      return res.render('add-staff', { data });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    let log = {
      email: req.body.email,
      password: hashedPassword,
      rawpassword: req.body.password,
      role: 3,
    };
    const result3 = await loginDB(log).save();
    let reg = {
      login_id: result3._id,
      name: req.body.name,
      phone: req.body.phone,
      place: req.body.place,
      // designation: req.body.designation,
    };
    const result4 = await staffDB(reg).save();

    if (result4) {
      // return res.json({
      //   Success: true,
      //   Error: false,
      //   logdata: result3,
      //   regdata: result4,
      //   Message: 'Staff Registration Successful',
      // });
      const data = {
        Success: true,
        Error: false,
        Message: 'Staff added successfully',
      };
      return res.render('add-staff', { data });
    } else {
      // return res.json({
      //   Success: false,
      //   Error: true,
      //   Message: 'Registration Failed',
      // });
      const data = {
        Success: false,
        Error: true,
        Message: 'Failed adding staff ',
      };
      return res.render('add-staff', { data });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
    });
  }
});

//Physician Registration
registerRoutes.post('/physician', async (req, res) => {
  try {
    console.log(req.body);
    const oldPhysician = await loginDB.findOne({ email: req.body.email });
    if (oldPhysician) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Email already exist, Please Log In',
      });
    }
    const oldPhysicianPhone = await physicianDB.findOne({
      phone: req.body.phone,
    });
    if (oldPhysicianPhone) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Phone already exist',
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    let log = {
      email: req.body.email,
      password: hashedPassword,
      rawpassword: req.body.password,
      role: 4,
    };
    const result3 = await loginDB(log).save();
    let reg = {
      login_id: result3._id,
      name: req.body.name,
      phone: req.body.phone,
      place: req.body.place,
      // designation: req.body.designation,
    };
    const result4 = await physicianDB(reg).save();

    if (result4) {
      return res.json({
        Success: true,
        Error: false,
        logdata: result3,
        regdata: result4,
        Message: 'Physician Registration Successful',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Registration Failed',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
    });
  }
});

//Change password
registerRoutes.put('/pass-change/:login_id', async (req, res) => {
  const loginData = await loginDB.findOne({ _id: req.params.login_id });
  console.log(loginData);
  const confirmPassword = await bcrypt.compare(
    req.body.password,
    loginData.password
  );
  // console.log(confirmPassword);
  if (confirmPassword === false) {
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: "Old Password doesn't match",
    });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    if (loginData.role === 2) {
      var updatePassword = await loginDB.updateOne(
        { _id: req.params.login_id },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
    } else {
      var updatePassword = await loginDB.updateOne(
        { _id: req.params.login_id },
        {
          $set: {
            password: hashedPassword,
            rawpassword: req.body.new_password,
          },
        }
      );
    }
    console.log(updatePassword);
    if (updatePassword) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'password updated',
      });
      // res.send('password matched');
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Error while updating password',
      });
    }
  }
});

module.exports = registerRoutes;
