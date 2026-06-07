const Booking =
require('../models/Booking');


// LOCK SLOT
exports.lockSlot = async(req,res)=>{

try{

const {
name,
phone,
game,
category,
seat,
slot,
date,
amount
} = req.body;

// CHECK EXISTING BOOKING
const existingBooking =
await Booking.findOne({

game,
seat,
slot,
date,

$or:[

{
status:'booked'
},

{
status:'locked',

lockedUntil:{
$gt:new Date()
}

}

]

});


if(existingBooking){

return res.status(400).json({

message:'Slot Already Reserved'

});

}


// CREATE LOCK
const booking =
await Booking.create({

name,
phone,
game,
category,
seat,
slot,
date,
amount,

status:'locked',

lockedUntil:new Date(
Date.now()+10*60*1000
)

});


res.json({

message:'Slot Locked',

booking

});

}catch(err){

res.status(500).json(err);

}

};


// CONFIRM BOOKING
exports.confirmBooking =
async(req,res)=>{

try{

const booking =
await Booking.findById(
req.params.id
);

if(!booking){

return res.status(404).json({

message:'Booking Not Found'

});

}

booking.status='booked';

booking.paymentStatus='paid';

await booking.save();

res.json({

message:'Booking Confirmed'

});

}catch(err){

res.status(500).json(err);

}

};
// AUTO REMOVE EXPIRED BOOKINGS
setInterval(async()=>{

try{

const now = new Date();

const bookings =
await Booking.find({
status:'booked'
});

for(const booking of bookings){

// booking date + slot extract
const bookingDate =
new Date(booking.date);

const slotStart =
booking.slot.split('–')[0].trim();

// TIME PARSE
let [time,modifier] =
slotStart.split(' ');

let [hours,minutes] =
time.split(':');

hours = parseInt(hours);
minutes = parseInt(minutes);

if(modifier === 'PM' && hours !== 12){
hours += 12;
}

if(modifier === 'AM' && hours === 12){
hours = 0;
}

// FINAL DATE TIME
bookingDate.setHours(hours);
bookingDate.setMinutes(minutes);
bookingDate.setSeconds(0);

// IF SLOT TIME PASSED
if(now > bookingDate){

await Booking.findByIdAndDelete(
booking._id
);

console.log(
`Expired booking removed: ${booking.game}`
);

}

}

}catch(err){

console.log(err);

}

},60000);


// GET ALL BOOKINGS
exports.getBookings =
async(req,res)=>{

try{

const bookings =
await Booking.find()
.sort({createdAt:-1});

res.json(bookings);

}catch(err){

res.status(500).json(err);

}

};