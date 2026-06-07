const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_SECRET
});

exports.createOrder = async(req,res)=>{

  try{

    const options = {
      amount:req.body.amount*100,
      currency:'INR'
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  }catch(err){
    res.status(500).json(err);
  }
};

exports.verifyPayment = async(req,res)=>{

  try{

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expected = crypto
    .createHmac('sha256',process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

    if(expected === razorpay_signature){
      return res.json({success:true});
    }

    return res.status(400).json({success:false});

  }catch(err){
    res.status(500).json(err);
  }
};