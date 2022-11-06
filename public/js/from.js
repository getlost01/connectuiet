const signup = document.querySelectorAll('.signup');
const signupInput= document.querySelectorAll('.signupInput');

signup.forEach(element => {
    element.classList.add('hidden');
});
signupInput.forEach(element => {
    element.removeAttribute("required");
});

document.querySelector('#login').addEventListener('click',()=>{
    submitbtn.removeAttribute("disabled");
    signup.forEach(element => {
        element.classList.add('hidden');
    });
    signupInput.forEach(element => {
        element.removeAttribute("required");
    });
    document.querySelector('#logSin').action = "/api/login" ;
    document.querySelector('#signup').classList.add('inactive');
    document.querySelector('#login').classList.remove('inactive');
})

document.querySelector('#signup').addEventListener('click',()=>{
    submitbtn.setAttribute("disabled","disabled");
    signup.forEach(element => {
        element.classList.remove('hidden');
    });
    signupInput.forEach(element => {
        element.setAttribute("required", "required");
    });
    document.querySelector('#logSin').action = "/api/register" ;
    document.querySelector('#signup').classList.remove('inactive');
    document.querySelector('#login').classList.add('inactive');
})
const login = document.querySelector('#login');
document.querySelector('#usernameSer').addEventListener('input',()=>{
    doSearch(document.querySelector('#usernameSer').value);
})
document.querySelector('#emailSer').addEventListener('input',()=>{
    if(login.classList.contains('inactive'))
    doSearchE(document.querySelector('#emailSer').value);
})
var delayTimer;
const errorMess = document.querySelector("#errorMessU");
const errorMessE = document.querySelector("#errorMessE");
async function doSearch(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(async function() {
        try {
            const response = await fetch(`/api/usernamesearch?uname=${text}`);
            const data = await response.json();
            if(data.found) 
            {errorMess.innerHTML = ` <h6 style="color: rgb(163, 59, 59);"> <i class="fa-solid fa-thumbs-down"></i> Username already taken</h6>`;
            submitbtn.setAttribute("disabled","disabled");
            }else{
            errorMess.innerHTML = '<h6 style="color: rgb(59, 163, 128);"> <i class="fa-solid fa-thumbs-up"></i> Username is free</h6>'
            submitbtn.removeAttribute("disabled");
            }} catch (error) {
            console.log(error);
        }
    }, 1000); 
}
async function doSearchE(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(async function() {
        try {
            const response = await fetch(`/api/emailSearch?email=${text}`);
            const data = await response.json();
            if(data.found) 
            {errorMessE.innerHTML = ` <h6 style="color: rgb(163, 59, 59);"> <i class="fa-solid fa-thumbs-down"></i> Email already exist</h6>`;
            submitbtn.setAttribute("disabled","disabled");
            }else{
            errorMessE.innerHTML = '<h6 style="color: rgb(59, 163, 128);"> <i class="fa-solid fa-thumbs-up"></i> Email is free</h6>'
            submitbtn.removeAttribute("disabled");
            }} catch (error) {
            console.log(error);
        }
    }, 1000); 
}