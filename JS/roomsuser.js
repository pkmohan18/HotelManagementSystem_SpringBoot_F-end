let checkIn = document.getElementById("check-in");
let checkOut = document.getElementById("check-out");
let dispRooms = document.getElementById("disp-rooms");
let dispMyRooms = document.getElementById("disp-my-rooms");

let rooms = JSON.parse(localStorage.getItem("rooms"));

let bookedRooms = localStorage.getItem("bookedRooms")
  ? JSON.parse(localStorage.getItem("bookedRooms"))
  : [];

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

function displayUserRooms() {
  let list = "";
  let count = 0;
  for (let room of rooms) {
    if (room.isAvailable && isRoomEmpty(room.roomNo)) {
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

function isRoomEmpty(roomNo) {
  if (bookedRooms.length == 0) return true;
  else {
    for (let broom of bookedRooms) {
      if ((broom.roomNo == roomNo) && (new Date(checkIn.value) < new Date(broom.checkOut))) {
        return false;
      } else return true;
    }
  }
}

function bookroom(roomNo) {
  if (confirm(`Do you want to book Room : ${roomNo} ?`)) {
    for (let room of rooms) {
      if (room.roomNo == roomNo) {
        bookedRooms.push({
          roomNo: room.roomNo,
          user: sessionStorage.getItem("email"),
          roomType: room.roomType,
          capacity: room.capacity,
          checkIn: checkIn.value,
          checkOut: checkOut.value,
          NoDays:
            (new Date(checkOut.value) - new Date(checkIn.value)) /
            (1000 * 60 * 60 * 24),
          totPrice:
            ((new Date(checkOut.value) - new Date(checkIn.value)) /
              (1000 * 60 * 60 * 24)) *
            Number(room.price),
          isApproved: false,
        });
        break;
      }
    }
    localStorage.setItem("bookedRooms", JSON.stringify(bookedRooms));
    document.querySelector(".error").style.display = "block";
    document.querySelector(".error").innerHTML = "Your booking has been submitted and sent for Admin approval!... Check MyBookings for Approval status..";
    document.querySelector(".error").style.color = "green";
    displayUserRooms();
    setTimeout(() => location.href = ("/html/viewmybooking.html"), 3000);
  }
}

function displayMyBookings(){
  let list = "";
  let count = 0;
  for (let broom of bookedRooms) {
    if(broom.user==sessionStorage.getItem("email")){
      list += `<tr>
            <td>${++count}</td>
            <td>${broom.roomNo}</td>
            <td>${broom.checkIn}</td>
            <td>${broom.checkOut}</td>
            <td>${broom.NoDays}</td>
            <td>${broom.totPrice}</td>
            <td>${broom.isApproved}</td>
            </tr>`;
    }
  }
  dispMyRooms.innerHTML = list;
}