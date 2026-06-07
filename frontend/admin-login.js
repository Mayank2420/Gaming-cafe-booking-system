document
.getElementById('loginForm')

.addEventListener('submit',async(e)=>{

e.preventDefault();

const email =
document.getElementById('email').value;

const password =
document.getElementById('password').value;

const res = await fetch(
'https://gaming-cafe-booking-system.onrender.com/api/admin/login',
{
method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({
email,
password
})

}
);

const data = await res.json();

console.log(data);

if(data.token){

localStorage.setItem(
'token',
data.token
);

window.location.href =
'admin.html';

}else{

alert('Login Failed');

}

});