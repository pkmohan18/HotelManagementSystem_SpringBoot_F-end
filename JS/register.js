let fname = document.querySelector("#fname");
let lname = document.querySelector("#lname");
let dob = document.querySelector("#dob");
let gender = document.querySelector("#gender");
let phno = document.querySelector("#phno");
let email = document.querySelector("#email");
let pass = document.querySelector("#pass");
let conpass = document.querySelector("#conpass");
let idType = document.getElementById("id-proof");
let idNo = document.getElementById("id-proof-no");

let users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

let phPattern = /^[6-9]\d{9}$/;
let emailPattern = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2,3})$/;
let passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_]).{8,}$/;
// ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$ 
document.addEventListener("submit",(e)=>{
    e.preventDefault();
    signUp();
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


function signUp() {
    if (validation()) {
        users.push({
            fname : fname.value,
            lname : lname.value,
            dob:dob.value,
            gender:gender.value,
            phno : phno.value,
            email:email.value,
            idType: idType.value,
            idNo: idNo.value,
            pass: pass.value,
            conpass: conpass.value,
            isAdmin: false,
            noRooms: 0,
          });
          localStorage.setItem("users", JSON.stringify(users));
          message("You've signed up successfully!",true);
          setTimeout(()=>location.href=("/html/login.html"),2000);
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
    else if(conpass.value.match(pass.value)) {
        for(let data of users) {
            if(email.value == data.email) {
                message("You already have an account please login!...");
                setTimeout(()=>location.href=("/html/login.html"),2000);
                return false;
            }
        }
    }

    else{
        message("Password and confirm password should match!...");
        return false;
    }
    return true;
}