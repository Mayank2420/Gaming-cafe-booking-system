async function bookNow(){

const orderData = await fetch(
'http://localhost:5000/api/payment/create-order',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
amount:150
})
}
);

const order = await orderData.json();

const options = {

key:'YOUR_RAZORPAY_KEY',
amount:order.amount,
currency:order.currency,
order_id:order.id,

handler: async function(response){

const verifyData = await fetch(
'http://localhost:5000/api/payment/verify',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify(response)
}
);

const result = await verifyData.json();

if(result.success){

await fetch(
'http://localhost:5000/api/bookings',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
name:'Mayank',
phone:'9999999999',
category:'PS5',
game:'FC25',
slot:document.getElementById('slot').value,
amount:150,
paymentStatus:'Paid'
})
}
);

alert('Booking Successful');
}
}
};

const rzp = new Razorpay(options);
rzp.open();
}