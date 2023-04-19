let fname = document.querySelector("#fname");
let lname = document.querySelector("#lname");
let dob = document.querySelector("#dob");
let gender = document.querySelector("#gender");
let phno = document.querySelector("#phno");
let email = document.querySelector("#email");
let pass = document.querySelector("#pass");
let conpass = document.querySelector("#conpass");

let users = JSON.parse(localStorage.getItem("users"));

phPattern = /^[6-9]\d{9}$/;
let emailPattern = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2,3})$/;
let passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_]).{8,}$/;

document.addEventListener("submit",(e)=>{
    e.preventDefault();
    updateProfile();
});

function message(msg,suc=false) {
    document.querySelector(".error").style.display = "block"
    document.querySelector(".error").innerHTML=msg;
    if(suc==true){
        document.querySelector(".error").style.color = "green";
      }
    document.onclick = () =>{
        document.querySelector(".error").style.display = "none";
    }
}

function insertData(){
    for(let user of users){
        if(user.email==sessionStorage.getItem("email")){
            fname.value=user.fname;
            lname.value=user.lname;
            dob.value=user.dob;
            gender.value=user.gender;
            phno.value=user.phno;
            email.value=user.email;
            pass.value=user.pass;
            conpass.value=user.conpass;
        }
    }
}

function updateProfile(){
    if(validation()){
        for(let user of users){
            if(user.email==email.value){
                user.fname=fname.value;
                user.lname=lname.value;
                user.dob=dob.value;
                user.gender=gender.value;
                user.phno=phno.value;
                user.email=email.value;
                user.pass=pass.value;
                user.conpass=conpass.value;
                localStorage.setItem("users",JSON.stringify(users));
                message("User Updated Successfully!...",true);
                setTimeout(()=>location.href="/html/userhome.html",2000);
                break;
            }
        }
    }
}

function validation() {
    if(!phno.value.match(phPattern)) {
        message("Please enter a valid mobile number!...");
        return false;
    }
    else if(!email.value.match(emailPattern)) {
        message("Please enter a valid email address!...");
        return false;
    }
    else if((pass.value).length<8) {
        message("Password should be atleast 8 characters long!...");
        return false;
    }
    else if(!pass.value.match(passPattern)) {
        message("Password should be strong!...");
        return false;
    }
    else if(!conpass.value.match(pass.value)) {
        message("Password and confirm password should match!...");
        return false;
    }

    else{
        return true;
    }
}