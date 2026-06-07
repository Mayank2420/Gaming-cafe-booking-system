const Booking = require('../models/Booking');
const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async(req,res)=>{

  try{

    const { email,password } = req.body;

    const admin = await Admin.findOne({ email });

    if(!admin){

      return res.status(404).json({
        message:'Admin Not Found'
      });

    }

    const match = await bcrypt.compare(
      password,
      admin.password
    );

    if(!match){

      return res.status(400).json({
        message:'Wrong Password'
      });

    }

    const token = jwt.sign(
      {
        id:admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn:'7d'
      }
    );

    res.json({
      token
    });

  }catch(err){

    res.status(500).json(err);

  }

};

exports.dashboard = async(req,res)=>{

  try{

    const bookings = await Booking.find();

    const revenue = bookings.reduce((acc,item)=>{
      return acc + item.amount;
    },0);

    res.json({

      totalBookings:bookings.length,

      totalRevenue:revenue,

      bookings

    });

  }catch(err){

    res.status(500).json(err);

  }

};