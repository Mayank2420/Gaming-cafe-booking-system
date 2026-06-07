async function lockSlot(){

const res = await fetch(

'http://localhost:5000/api/bookings/lock',

{

method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({

name:'Mayank',

phone:'9999999999',

game:'PS5',

seat:'PS5-1',

slot:'6PM-7PM',

amount:150

})

}

);

const data = await res.json();

if(data.booking){

localStorage.setItem(
'bookingId',
data.booking._id
);

alert('Slot Locked');

}else{

alert(data.message);

}

}