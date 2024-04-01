const express = require('express');
const medicineDB = require('../models/eventSchema');
const physicianRoutes = express.Router();
require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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

physicianRoutes.post('/add-med', upload.single('image'), async (req, res) => {
  try {
    const Medicine = {
      medicine: req.body.medicine,
      composition: req.body.composition,
      brand: req.body.brand,
      strength: req.body.strength,
      purpose: req.body.purpose,
      description: req.body.description,
      quantity: req.body.quantity,
      stock: req.body.stock,
      price: req.body.price,
      image: req.file ? req.file.path : null,
    };
    const Data = await medicineDB(Medicine).save();
    // console.log(Data);
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Medicine added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Medicine ',
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

physicianRoutes.put(
  '/update-med/:id',
  upload.single('image'),
  async (req, res) => {
    try {
      const previousData = await medicineDB.findOne({ _id: req.params.id });

      var Medicine = {
        medicine: req.body ? req.body.medicine : previousData.medicine,
        composition: req.body ? req.body.medicine : previousData.composition,
        brand: req.body ? req.body.brand : previousData.brand,
        strength: req.body ? req.body.strength : previousData.strength,
        purpose: req.body ? req.body.purpose : previousData.purpose,
        description: req.body ? req.body.description : previousData.description,
        quantity: req.body ? req.body.quantity : previousData.quantity,
        price: req.body ? req.body.price : previousData.price,
        image: req.file ? req.file.path : previousData.image,
      };
      console.log(Medicine);
      const Data = await medicineDB.updateOne(
        { _id: req.params.id },
        { $set: Medicine }
      );

      if (Data) {
        return res.status(200).json({
          Success: true,
          Error: false,
          data: Data,
          Message: 'Medicine updated successfully',
        });
      } else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Failed while updating Medicine',
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
  }
);

physicianRoutes.delete('/delete-med/:id', async (req, res) => {
  try {
    const Data = await medicineDB.deleteOne({ _id: req.params.id });
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

module.exports = physicianRoutes;
