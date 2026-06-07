const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB Connected'))
.catch((err)=>console.log(err));

app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`Server running on ${PORT}`);
});
const gameRoutes =
require('./routes/gameRoutes');
app.use('/api/games',gameRoutes);
const Booking =
require('./models/Booking');

setInterval(async()=>{

try{

const result =
await Booking.deleteMany({

status:'locked',

lockedUntil:{
$lt:new Date()
}

});

if(result.deletedCount>0){

console.log(
`${result.deletedCount} Expired Slots Removed`
);

}

}catch(err){

console.log(err);

}

},60000);