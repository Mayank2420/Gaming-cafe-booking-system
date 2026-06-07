const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

phone:{
type:String,
required:true
},

game:{
type:String,
required:true
},
category:{
type:String,
default:''
},


seat:{
type:String,
required:true
},

slot:{
type:String,
required:true
},

date:{
type:String,
required:true
},

amount:{
type:Number,
required:true
},

paymentStatus:{
type:String,
default:'pending'
},

status:{
type:String,
enum:['locked','booked'],
default:'locked'
},

lockedUntil:{
type:Date
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Booking',
bookingSchema
);