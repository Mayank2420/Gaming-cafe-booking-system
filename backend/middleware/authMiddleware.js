const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{

  try{

    const token = req.headers.authorization;

    if(!token){
      return res.status(401).json({
        message:'No Token'
      });
    }

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.admin = verified;

    next();

  }catch(err){

    res.status(401).json({
      message:'Invalid Token'
    });

  }

};