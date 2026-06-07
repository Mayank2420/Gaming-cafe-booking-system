const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

category:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

time:{
type:String,
required:true
},

offer:{
type:String,
default:''
},

image:{
type:String,
default:''
}

});

module.exports =
mongoose.model('Game',gameSchema);