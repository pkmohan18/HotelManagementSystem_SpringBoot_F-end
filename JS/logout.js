
function logout(){
    document.querySelector(".error").style.display = "block";
    document.querySelector(".error").innerHTML = "Logged out Successfully!...";
    document.querySelector(".error").style.color = "green";
    setTimeout(()=>location.href=("/html/index.html"),1000);
    sessionStorage.clear();
  }