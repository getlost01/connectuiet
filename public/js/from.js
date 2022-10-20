const signup = document.querySelectorAll('.signup');
const signupInput= document.querySelectorAll('.signupInput');

signup.forEach(element => {
    element.classList.add('hidden');
});
signup.forEach(element => {
    element.attributes.required = "";
});

document.querySelector('#login').addEventListener('click',()=>{
    signup.forEach(element => {
        element.classList.add('hidden');
    });
    signup.forEach(element => {
        element.attributes.required = "";
    });
    document.querySelector('#logSin').action = "/api/login" ;
    document.querySelector('#signup').classList.add('inactive');
    document.querySelector('#login').classList.remove('inactive');
})

document.querySelector('#signup').addEventListener('click',()=>{
    signup.forEach(element => {
        element.classList.remove('hidden');
    });
    signup.forEach(element => {
        element.attributes.required = "required";
    });
    document.querySelector('#logSin').action = "/api/register" ;
    document.querySelector('#signup').classList.remove('inactive');
    document.querySelector('#login').classList.add('inactive');
})