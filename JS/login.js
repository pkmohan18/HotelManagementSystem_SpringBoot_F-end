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

async function logIn() {
  let resp = await fetch("http://localhost:8080/user/getByEmail?email="+email.value);
  if(resp.status==200){
    let user = await resp.json();
    if(user.password==pass.value){
      sessionStorage.setItem("email", email.value);
      sessionStorage.setItem("fname",user.fname);
      sessionStorage.setItem("password", pass.value);
      if(user.isAdmin){
        message(`Admin Logged in successfully!...`,true);
        setTimeout(()=>location.href=("/html/adminhome.html"),1000);
        return
      }
      else{
        message(`Hello ${user.fname}!. You've Logged in successfully!...`,true);
        setTimeout(()=>location.href=("/html/userhome.html"),1000);
        return
      }
    }
    else{
      message("Wrong Password Try again!...");
    }
  } 
  else {
    message("Invalid Email or Password!...");
  }
}

