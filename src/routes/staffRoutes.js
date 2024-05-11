const express = require('express');
const staffDB = require('../models/staffSchema');
const bookingsDB = require('../models/bookingSchema');
const eventDB = require('../models/eventSchema');

const staffRoutes = express.Router();

require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const productsDB = require('../models/productSchema');
const ordersDB = require('../models/orderSchema');
const loginDB = require('../models/loginSchema');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vatakara projects/event management',
  },
});
const upload = multer({ storage: storage });

staffRoutes.put('/update-staff-profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const oldData = await staffDB.findOne({ login_id: id });
    let reg = {
      name: req.body.name ? req.body.name : oldData.name,
      phone: req.body.phone ? req.body.phone : oldData.phone,
      place: req.body.place ? req.body.place : oldData.place,
    };

    const email = req.body.email;

    // console.log(reg);
    const update = await staffDB.updateOne({ login_id: id }, { $set: reg });
    const updateLog = await loginDB.updateOne(
      { _id: id },
      { $set: { email: email } }
    );
    if (update.modifiedCount == 1 || updateLog.modifiedCount == 1) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Profile updated',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Error while updating profile',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
      errorMessage: error.message,
      Message: 'Something went wrong!',
    });
  }
});

staffRoutes.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const Products = {
      name: req.body.name,
      color: req.body.color,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file.path : null,
    };
    const Data = await productsDB(Products).save();
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
        Message: 'Products added successfully',
        // return res.render('add-product', { data });
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Products ',
      });
      // const data = {
      //   Success: false,
      //   Error: true,
      //   Message: 'Failed adding Products ',
      // };
      // return res.ren.der('add-product', { data });
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

staffRoutes.put('/update-product/:id',,
  upload.single('image'), async (req, res) => {
  try {
    
    console.log("body:",req.body)
     console.log("name:",req.body.name)
    const previousData = await productsDB.findOne({ _id: req.params.id });
    console.log("previousData:",previousData)

    var Products = {
      name: req.body.name ? req.body.name : previousData.name,
      color: req.body.color ? req.body.color : previousData.color,
      price: req.body.price ? req.body.price : previousData.price,
      description: req.body.description ? req.body.description : previousData.description,
      image: req.file ? req.file.path : previousData.image,
    };
     console.log(Products);
    const Data = await productsDB.updateOne(
      { _id: req.params.id },
      { $set: Products }
    );

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'products updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating products',
      });
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

staffRoutes.delete('/delete-product/:id', async (req, res) => {
  try {
    const Data = await productsDB.deleteOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Product deleted successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to delete product',
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

staffRoutes.put('/attendance/:id', async (req, res) => {
  try {
    const loginId = req.params.id;
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    // const date = new Date();
    const date = formatDate(new Date());
    const isPresent = true;
    // const isPresent = req.body.isPresent;

    const result = await staffDB.updateOne(
      { login_id: loginId },
      { $push: { attendance: { date, isPresent } } }
    );

    // if (result.nModified === 0) {
    //   return res.status(404).json({ message: 'Staff member not found' });
    // }
    if (result) {
      return res
        .status(200)
        .json({ message: 'Attendance updated successfully', isPresent: true });
    } else {
      return res.status(404).json({ message: 'Staff member not found' });
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

// ================================================================
staffRoutes.post('/add-event', upload.single('image'), async (req, res) => {
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
        // return res.render('add-product', { data });
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Event ',
      });
      // const data = {
      //   Success: false,
      //   Error: true,
      //   Message: 'Failed adding product ',
      // };
      // return res.ren.der('add-product', { data });
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

staffRoutes.put('/update-event/:id',
  upload.single('image'), async (req, res) => {
  try {
    const previousData = await eventDB.findOne({ _id: req.params.id });

    var Events = {
      event_type: req.body.event_type ? req.body.event_type : previousData.event_type,
      description: req.body.description ? req.body.description : previousData.description,
      price: req.body.price ? req.body.price : previousData.price,
      image: req.file ? req.file.path : previousData.image,
    };
    // console.log(Events);
    const Data = await eventDB.updateOne(
      { _id: req.params.id },
      { $set: Events }
    );

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Events updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating Events',
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

staffRoutes.put('/update-booking-stat/:id/:booked_date', async (req, res) => {
  try {
    const loginId = req.params.id;
    const bookedDate = req.params.booked_date;

    const result = await bookingsDB.updateOne(
      { login_id: loginId, date: bookedDate },
      { $set: { status: 'confirmed' } }
    );

    // if (result.nModified === 0) {
    //   return res.status(404).json({ message: 'Staff member not found' });
    // }
    if (result) {
      return res
        .status(200)
        .json({ message: 'Booking status updated successfully' });
    } else {
      return res.status(404).json({ message: 'Staff member not found' });
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

staffRoutes.get('/delete-event/:id', async (req, res) => {
  try {
    const Data = await eventDB.deleteOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Event deleted successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to delete Event',
      });
    }
    // if (Data.deletedCount == 1) {
    //   // const Data = await loginData.deleteOne({ _id: id });
    //   return res.redirect('/api/admin/view-med');
    // } else {
    //   return res.redirect('/api/admin/view-med');
    // }
  } catch (error) {
    // return res.redirect('/api/admin/view-med');

    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

staffRoutes.get('/view-bookings', async (req, res) => {
  try {
    // const bookings = await bookingsDB.find();
    const bookings = await bookingsDB.aggregate([
      {
        $lookup: {
          from: 'events_tbs',
          localField: 'event_id',
          foreignField: '_id',
          as: 'events_data',
        },
      },
      {
        $unwind: {
          path: '$events_data',
        },
      },
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'login_data',
        },
      },
      {
        $unwind: {
          path: '$login_data',
        },
      },
    ]);

    if (bookings) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: bookings.length > 0 ? bookings : [],
        Message: 'Events fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Events fetching failed',
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

staffRoutes.get('/delete-booking/:id', async (req, res) => {
  try {
    const Data = await bookingsDB.deleteOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Booking deleted successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to delete booking',
      });
    }
    // if (Data.deletedCount == 1) {
    //   // const Data = await loginData.deleteOne({ _id: id });
    //   return res.redirect('/api/admin/view-med');
    // } else {
    //   return res.redirect('/api/admin/view-med');
    // }
  } catch (error) {
    // return res.redirect('/api/admin/view-med');

    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

staffRoutes.get('/view-orders', async (req, res) => {
  try {
    const result = await ordersDB.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'products_data',
        },
      },
      {
        $unwind: {
          path: '$products_data',
        },
      },
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'login_data',
        },
      },
      {
        $unwind: {
          path: '$login_data',
        },
      },
    ]);
    // console.log('result', result);
    if (result) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Data: result,
        Message: 'Order data fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Order data fetching failed',
      });
    }
    // return res.send(result);
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

module.exports = staffRoutes;
