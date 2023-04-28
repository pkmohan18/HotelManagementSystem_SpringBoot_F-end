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

let phPattern = /^[6-9]\d{9}$/;
let emailPattern = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2,3})$/;
let passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_]).{8,}$/;
// ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$ 

document.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!phno.value.match(phPattern)) {
        message("Please enter a valid mobile number!...");
    }
    else if(!email.value.match(emailPattern)) {
        message("Please enter a valid email address!...");
    }
    else if((pass.value).length<8) {
        message("Password should be atleast 8 characters long!...");
    }
    else if(!pass.value.match(passPattern)) {
        message("Password should be strong!...");
    }
    else if(!conpass.value.match(pass.value)) {
        message("Password and confirm password should match!...");
    }
    else{
        checkUser();
    }
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


async function signUp() {
    let user= {
        fname : fname.value,
        lname : lname.value,
        dob:dob.value,
        gender:gender.value,
        phno : phno.value,
        email:email.value,
        idType: idType.value,
        idNo: idNo.value,
        password: pass.value,
        con_password: conpass.value,
        isAdmin: false,
        noRooms: 0,
        };
        let resp = await fetch("http://localhost:8080/user/save",{
        method :'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(user),
        })

        message("You've signed up successfully!",true);
        setTimeout(()=>location.href=("/html/login.html"),1000);
}

async function checkUser(){
    let resp = await fetch("http://localhost:8080/user/getByEmail?email="+email.value);
    if(resp.status==200){
        message("User already exists please login!...");
        setTimeout(()=>location.href=("/html/login.html"),1000);
    }
    else
        signUp();
}
