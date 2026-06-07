const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

require('dotenv').config();

const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI)

.then(async()=>{

const hashedPassword =
await bcrypt.hash('admin123',10);

await Admin.create({

email:'admin@gamingjunction.com',

password:hashedPassword

});

console.log('Admin Created');

process.exit();

});