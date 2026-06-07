const Game = require('../models/Game');

exports.addGame = async(req,res)=>{

try{

const game = await Game.create(req.body);

res.json(game);

}catch(err){

res.status(500).json(err);

}

};

exports.getGames = async(req,res)=>{

try{

const games = await Game.find();

res.json(games);

}catch(err){

res.status(500).json(err);

}

};

exports.deleteGame = async(req,res)=>{

try{

await Game.findByIdAndDelete(
req.params.id
);

res.json({
message:'Game Deleted'
});

}catch(err){

res.status(500).json(err);

}

};

exports.updateGame = async(req,res)=>{

try{

const updated =
await Game.findByIdAndUpdate(

req.params.id,

req.body,

{ new:true }

);

res.json(updated);

}catch(err){

res.status(500).json(err);

}

};