const express = require('express');
const medicineDB = require('../models/eventSchema');
const staffDB = require('../models/staffSchema');
const loginDB = require('../models/loginSchema');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const complaintsDB = require('../models/complaintSchema');
const adminRoutes = express.Router();
adminRoutes.use(express.static('./public'));
require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const eventDB = require('../models/eventSchema');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vatakara projects/medicine management',
  },
});
const upload = multer({ storage: storage });

// ------------------------------Medicine--------------------------------------

adminRoutes.get('/', async (req, res) => {
  res.render('dashboard');
});

adminRoutes.get('/add-medicine', async (req, res) => {
  const data = {};
  res.render('add-turf', { data });
});

adminRoutes.post('/add-event', upload.single('image'), async (req, res) => {
  try {
    const Event = {
      event_type: req.body.event_type,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file.path : null,
    };
    const Data = await eventDB(Event).save();
    // console.log(Data);
    if (Data) {
      // const data = {
      //   Success: true,
      //   Error: false,
      //   Message: 'Event added successfully',
      // };
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Event added successfully',
        // return res.render('add-turf', { data });
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Medicine ',
      });
      // const data = {
      //   Success: false,
      //   Error: true,
      //   Message: 'Failed adding turf ',
      // };
      // return res.ren.der('add-turf', { data });
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

adminRoutes.get('/view-event', async (req, res) => {
  try {
    const Data = await eventDB.find();

    // if (Data) {
    //   const data = {};
    //   return res.render('view-medicine', { Data, data });
    // }

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Events fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Events',
      });
    }
  } catch (error) {
    // const data = {
    //   Message: ' Error',
    // };
    // const Data = [];
    // return res.render('view-medicine', { Data, data });

    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});
adminRoutes.get('/edit-event/:id', async (req, res) => {
  try {
    const Data = await eventDB.findOne({ _id: req.params.id });

    if (Data) {
      const data = {};

      res.render('edit-medicine', { Data, data });
    }
  } catch (error) {
    const data = {
      Message: 'Error',
    };
    const Data = [];
    return res.render('view-medicine', { Data, data });
  }
});

adminRoutes.put(
  '/update-event/:id',
  upload.single('image'),
  async (req, res) => {
    try {
      const previousData = await eventDB.findOne({ _id: req.params.id });

      var Event = {
        event_type: req.body ? req.body.event_type : previousData.event_type,
        description: req.body ? req.body.description : previousData.description,
        price: req.body ? req.body.price : previousData.price,
        image: req.file ? req.file.path : previousData.image,
      };
      console.log(Event);
      const Data = await eventDB.updateOne(
        { _id: req.params.id },
        { $set: Event }
      );

      // if (Data) {
      // return res.status(200).json({
      //   Success: true,
      //   Error: false,
      //   data: Data,
      //   Message: 'Medicine updated successfully',
      // });
      // }
      if (Data.modifiedCount == 1) {
        // const Data = await loginData.deleteOne({ _id: id });
        return res.redirect('/api/admin/view-med');
      } else {
        // return res.status(400).json({
        //   Success: false,
        //   Error: true,
        //   Message: 'Failed while updating Medicine',
        // });
        return res.redirect('/api/admin/view-med');
      }
    } catch (error) {
      return res.status(500).json({
        Success: false,
        Error: true,
        Message: 'Internal Server Error',
        ErrorMessage: error.message,
      });
    }
  }
);

adminRoutes.get('/delete-event/:id', async (req, res) => {
  try {
    const Data = await eventDB.deleteOne({ _id: req.params.id });
    // if (Data) {
    //   return res.status(200).json({
    //     Success: true,
    //     Error: false,
    //     data: Data,
    //     Message: 'Product deleted successfully',
    //   });
    // } else {
    //   return res.status(400).json({
    //     Success: false,
    //     Error: true,
    //     Message: 'Failed to delete product',
    //   });
    // }
    if (Data.deletedCount == 1) {
      // const Data = await loginData.deleteOne({ _id: id });
      return res.redirect('/api/admin/view-med');
    } else {
      return res.redirect('/api/admin/view-med');
    }
  } catch (error) {
    return res.redirect('/api/admin/view-med');

    // return res.status(500).json({
    //   Success: false,
    //   Error: true,
    //   Message: 'Internal Server Error',
    //   ErrorMessage: error.message,
    // });
  }
});

// ------------------------------Staff--------------------------------------

adminRoutes.get('/new-staff', async (req, res) => {
  const data = {};
  res.render('add-staff', { data });
});

//Staff Registration
adminRoutes.post('/staff', async (req, res) => {
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

adminRoutes.get('/view-staff', async (req, res) => {
  try {
    // const staffData = await staffDB.aggregate([
    const Data = await staffDB.aggregate([
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          name: {
            $first: '$name',
          },
          phone: {
            $first: '$phone',
          },
          place: {
            $first: '$place',
          },
          designation: {
            $first: '$designation',
          },
          email: {
            $first: '$result.email',
          },
          rawpassword: {
            $first: '$result.rawpassword',
          },
        },
      },
    ]);

    // if (staffData.length > 0) {
    if (Data.length > 0) {
      // return res.json({
      //   Success: true,
      //   Error: false,
      //   data: staffData,
      //   Message: 'Success',
      // });
      const data = {};
      return res.render('view-staff', { Data, data });
    } else {
      // return res.json({
      //   Success: false,
      //   Error: true,
      //   Message: 'Failed',
      // });
      const data = {
        Message: ' Error',
      };
      const Data = [];
      return res.render('view-staff', { Data, data });
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

adminRoutes.get('/view-staff/:id', async (req, res) => {
  try {
    const user_id = req.params.id;
    const staffData = await staffDB.aggregate([
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          name: {
            $first: '$name',
          },
          phone: {
            $first: '$phone',
          },
          place: {
            $first: '$place',
          },
          designation: {
            $first: '$designation',
          },
          email: {
            $first: '$result.email',
          },
          rawpassword: {
            $first: '$result.rawpassword',
          },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
        },
      },
    ]);

    if (staffData.length > 0) {
      return res.json({
        Success: true,
        Error: false,
        data: staffData,
        Message: 'Success',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Failed',
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

adminRoutes.put('/update-staff/:id', async (req, res) => {
  try {
    var loginID = req.params.id;
    const previousData = await staffDB.findOne({
      login_id: loginID,
    });
    const previousloginData = await loginDB.findOne({
      _id: loginID,
    });
    var Staff = {
      login_id: previousData.login_id,
      name: req.body ? req.body.name : previousData.name,
      phone: req.body ? req.body.phone : previousData.phone,
      place: req.body ? req.body.place : previousData.place,
      //  image:
      //    req.file && req.file.length > 0
      //      ? req.file.path)
      //      : previousData.image,
    };
    if (req.body.password !== undefined) {
      var hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    var StaffLoginDetails = {
      email: req.body ? req.body.email : previousloginData.email,
      password: req.body ? hashedPassword : previousloginData.password,
      rawpassword: req.body ? req.body.password : previousloginData.rawpassword,
    };

    const Data = await staffDB.updateOne(
      { login_id: loginID },
      { $set: Staff }
    );
    const LoginData = await loginDB.updateOne(
      { _id: loginID },
      { $set: StaffLoginDetails }
    );

    if (Data && LoginData) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        loginData: LoginData,
        Message: 'Staff details updated successfully ',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating Staff details',
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

adminRoutes.get('/delete-staff/:login_id', async (req, res) => {
  try {
    // const staffData = await staffDB.deleteOne({
    const Data = await staffDB.deleteOne({
      login_id: req.params.login_id,
    });
    const logData = await loginDB.deleteOne({ _id: req.params.login_id });
    // if (staffData && logData) {
    //   return res.status(200).json({
    //     Success: true,
    //     Error: false,
    //     Message: 'Deleted staff data',
    //   });
    // }
    if (Data.deletedCount == 1 && logData.deletedCount == 1) {
      return res.redirect('/api/admin/view-staff');
    } else {
      return res.redirect('/api/admin/view-staff');
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

adminRoutes.get('/view-complaints', async (req, res) => {
  try {
    const Data = await complaintsDB.aggregate([
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'login_data',
        },
      },
      {
        $unwind: '$login_data',
      },
      {
        $lookup: {
          from: 'register_tbs',
          localField: 'login_id',
          foreignField: 'login_id',
          as: 'register_data',
        },
      },
      {
        $unwind: '$register_data',
      },
    ]);
    if (Data) {
      // return res.status(201).json({
      //   Success: true,
      //   Error: false,
      //   data: Data,
      //   Message: 'Complaint fetched successfully',
      // });
      const data = {};
      return res.render('view-complaints', { Data, data });
    } else {
      // return res.status(400).json({
      //   Success: false,
      //   Error: true,
      //   Message: 'Failed fetching Complaint ',
      // });
      const data = {
        Message: ' Error',
      };
      const Data = [];
      return res.render('view-complaints', { Data, data });
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

adminRoutes.get('/view-attendance', async (req, res) => {
  try {
    // const staffData = await staffDB.aggregate([
    const Data = await staffDB.aggregate([
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          name: {
            $first: '$name',
          },
          phone: {
            $first: '$phone',
          },
          place: {
            $first: '$place',
          },
          designation: {
            $first: '$designation',
          },
          email: {
            $first: '$result.email',
          },
          rawpassword: {
            $first: '$result.rawpassword',
          },
          attendanceCount: { $first: { $size: '$attendance' } },
        },
      },
    ]);

    // if (staffData.length > 0) {
    if (Data.length > 0) {
      // return res.json({
      //   Success: true,
      //   Error: false,
      //   data: staffData,
      //   Message: 'Success',
      // });
      const data = {};
      console.log(Data);
      return res.render('attendance', { Data, data });
    } else {
      // return res.json({
      //   Success: false,
      //   Error: true,
      //   Message: 'Failed',
      // });
      const data = {
        Message: ' Error',
      };
      const Data = [];
      return res.render('attendance', { Data, data });
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

adminRoutes.get('/view-attendance/:login_id', async (req, res) => {
  try {
    const loginId = req.params.login_id;
    const Data = await staffDB.findOne({ login_id: loginId });
    console.log(Data.name);
    if (Data) {
      const data = {};
      res.render('staff-attendance', { Data, data });
      // return res.status(404).json({ message: 'Staff not found' });
    } else {
      const data = {
        Message: ' Error',
      };
      const Data = [];
      return res.render('staff-attendance', { Data, data });
    }
    // res.json({ attendance: staff.attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

module.exports = adminRoutes;
