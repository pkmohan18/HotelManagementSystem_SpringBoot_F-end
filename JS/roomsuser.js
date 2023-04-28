let checkIn = document.getElementById("check-in");
let checkOut = document.getElementById("check-out");
let dispRooms = document.getElementById("disp-rooms");
let dispMyRooms = document.getElementById("disp-my-rooms");

function message(msg, suc = false) {
  document.querySelector(".error").style.display = "block";
  document.querySelector(".error").innerHTML = msg;
  if (suc == true) {
    document.querySelector(".error").style.color = "green";
  }
  document.onclick = () => {
    document.querySelector(".error").style.display = "none";
  };
}

document.addEventListener("submit", (e) => {
  e.preventDefault();
  displayUserRooms();
});

async function displayUserRooms() {
  let resp = await fetch("http://localhost:8080/room/get");
  if(resp.status==200){
    let rooms = await resp.json();
    let list = "";
    let count = 0;
    for (let room of rooms) {
      if (room.isAvailable && await isRoomEmpty(room.roomNo)) {
        list += `<tr>
              <td>${++count}</td>
              <td>${room.roomNo}</td>
              <td>${room.roomType}</td>
              <td>${room.capacity}</td>
              <td>${room.price}</td>
              <td><i class="fa-solid fa-right-to-bracket" onclick="bookroom('${room.roomNo
          }')"></i></td>
              </tr>`;
      }
    }
    dispRooms.innerHTML = list;
  }
}

async function isRoomEmpty(num) {
  let resp = await fetch("http://localhost:8080/bookedRoom/getByNo?num="+num);
  if(resp.status!=200)
    return true;
  else{
    let broom = await resp.json();
    if ((new Date(checkIn.value) < new Date(broom.checkOut))) {
      return false;
    } else return true;
  }
}

async function bookroom(roomNo) {
  if (confirm(`Do you want to book Room : ${roomNo} ?`)) {
    let resp = await fetch("http://localhost:8080/room/getByNo?num="+roomNo);
    let room = await resp.json();
    let bookedRooms = {
          roomNo: room.roomNo,
          user: sessionStorage.getItem("email"),
          roomType: room.roomType,
          capacity: room.capacity,
          checkIn: checkIn.value,
          checkOut: checkOut.value,
          noDays: (new Date(checkOut.value) - new Date(checkIn.value)) / (1000 * 60 * 60 * 24),
          totPrice:
            ((new Date(checkOut.value) - new Date(checkIn.value)) /
              (1000 * 60 * 60 * 24)) *
            Number(room.price),
          isApproved: false,
      };
      let response = await fetch("http://localhost:8080/bookedRoom/save",{
            method :'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(bookedRooms),
            });
      console.log(await response.text());
      document.querySelector(".error").style.display = "block";
      document.querySelector(".error").innerHTML = "Your booking has been submitted and sent for Admin approval!... Check MyBookings for Approval status..";
      document.querySelector(".error").style.color = "green";
      displayUserRooms();
      setTimeout(() => location.href = ("/html/viewmybooking.html"), 3000);
    }
  }

async function displayMyBookings(){
  let resp = await fetch("http://localhost:8080/bookedRoom/get");
  if(resp.status==200){
    let bookedRooms = await resp.json();
    let list = "";
    let count = 0;
    for (let broom of bookedRooms) {
      if(broom.user==sessionStorage.getItem("email")){
        list += `<tr>
              <td>${++count}</td>
              <td>${broom.roomNo}</td>
              <td>${broom.checkIn}</td>
              <td>${broom.checkOut}</td>
              <td>${broom.noDays}</td>
              <td>${broom.totPrice}</td>
              <td>${broom.isApproved}</td>
              <td><i class="fa-solid fa-trash" onclick="delbroom('${broom.id}')"></i></td>
              </tr>`;
      }
    }
    dispMyRooms.innerHTML = list;
  }
}

async function delbroom(id){
  let resp = await fetch("http://localhost:8080/bookedRoom/delete?id="+id,{
        method : "DELETE"
    });
    let msg = await resp.text();
    message(msg);
    location.reload();
}