let email = document.querySelector("#email");
let pass = document.querySelector("#pass");

document.addEventListener("submit", (e) => {
  e.preventDefault();
  logIn();
});

function message(msg,suc=false) {
  document.querySelector(".error").style.display = "block";
  document.querySelector(".error").innerHTML = msg;
  if(suc==true){
    document.querySelector(".error").style.color = "green";
  }
  document.onclick = () =>{
    document.querySelector(".error").style.display = "none";
  }
}

function logIn() {
  let users = localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : [];
  for (let check of users) {
    if (email.value == check.email && pass.value == check.pass) {
      sessionStorage.setItem("email", email.value);
      sessionStorage.setItem("fname",check.fname);
      sessionStorage.setItem("password", pass.value);
      if(check.isAdmin){
        message(`Admin Logged in successfully!...`,true);
        setTimeout(()=>location.href=("/html/adminhome.html"),1000);
        return
      }
      else{
        message(`Hello ${check.fname}!. You've Logged in successfully!...`,true);
        setTimeout(()=>location.href=("/html/userhome.html"),1000);
        return
      }
    } else {
      message("Invalid Email or Password!...");
      
    }
  }
}

