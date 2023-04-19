let users = JSON.parse(localStorage.getItem("users"));
dispUsers = document.getElementById("disp-users");

function display() {
    let list = "";
    let count = 0;
    for (let user of users) {
        list += `<tr>
        <td>${++count}</td>
        <td>${user.fname + " " + user.lname}</td>
        <td>${user.email}</td>
        <td>${user.phno}</td>
        <td>${user.noRooms}</td>
        <td><i class="fa-solid fa-trash" onclick="delUser('${user.email}')"></i></td>
        </tr>`;
    }
    dispUsers.innerHTML = list;
}

function delUser(email) {
    users = users.filter((u) => {
        return u.email != email;
    });
    localStorage.setItem("users", JSON.stringify(users));
    display();
}

let roomNo = document.getElementById("room-no");
let roomType = document.getElementById("room-type");
let capacity = document.getElementById("capacity");
let price = document.getElementById("price");
let btn = document.getElementById("btn");
let isAvailable = document.getElementById("available");

let dispRooms = document.getElementById("disp-rooms");

let rooms = localStorage.getItem("rooms") ? JSON.parse(localStorage.getItem("rooms")) : [];

function message(msg, suc = false) {
    document.querySelector(".error").style.display = "block"
    document.querySelector(".error").innerHTML = msg;
    if (suc == true) {
        document.querySelector(".error").style.color = "green";
    }
    document.onclick = () => {
        document.querySelector(".error").style.display = "none";
    }
}

document.addEventListener("submit", (e) => {
    e.preventDefault();
    let cond = true;
    for (let room of rooms) {
        if (roomNo.value == room.roomNo) {
            cond = false;
            break;
        }
    }
    if (btn.value == "Update")
        updateRooms();
    else
        if (!cond)
            message("Room with this Room No Already Exists!...");
        else
            addRooms();
});

function addRooms() {
    rooms.push({
        roomNo: roomNo.value,
        roomType: roomType.value,
        capacity: capacity.value,
        price: price.value,
        isAvailable: isAvailable.checked,
    });
    localStorage.setItem("rooms", JSON.stringify(rooms));
    message("Room added successfully!...", true);
    setTimeout(() => location.reload(), 500);
}

function displayRooms() {
    let list = "";
    let count = 0;
    for (let room of rooms) {
        list += `<tr>
        <td>${++count}</td>
        <td>${room.roomNo}</td>
        <td>${room.roomType}</td>
        <td>${room.capacity}</td>
        <td>${room.price}</td>
        <td>${room.isAvailable}</td>
        <td><i class="fa-solid fa-pen-to-square" onclick="editroom('${room.roomNo}')"></i></td>
        <td><i class="fa-solid fa-trash" onclick="delroom('${room.roomNo}')"></i></td>
        </tr>`;
    }
    dispRooms.innerHTML = list;
}

function delroom(roomNo) {
    rooms = rooms.filter((r) => {
        return r.roomNo != roomNo;
    });
    localStorage.setItem("rooms", JSON.stringify(rooms));
    displayRooms();
}

function editroom(no) {
    document.getElementById("room-no").style.readOnly = true;
    for (let room of rooms) {
        if (room.roomNo == no) {
            roomNo.value = room.roomNo;
            roomType.value = room.roomType;
            capacity.value = room.capacity;
            price.value = room.price;
            if (room.isAvailable)
                document.getElementById("available").checked = true;
            else
                document.getElementById("available").checked = false;
            btn.value = "Update";
            break;
        }
    }

}

function updateRooms() {
    for (let room of rooms) {
        if (room.roomNo == roomNo.value) {
            room.roomNo = roomNo.value;
            room.roomType = roomType.value;
            room.capacity = capacity.value;
            room.price = price.value;
            room.isAvailable = isAvailable.checked;
            localStorage.setItem("rooms", JSON.stringify(rooms));
            message("Room updated successfully!...", true);
            setTimeout(() => location.href = "/html/addrooms.html", 500);
            break;
        }
        else {
            message("Room No. does not exists!...");
        }
    }
}

bookedRooms = JSON.parse(localStorage.getItem("bookedRooms"));
dispBooking = document.getElementById("disp-booking");

function displayApprove() {
    let list = "";
    let count = 0;
    for (let broom of bookedRooms) {
        if (!broom.isApproved) {
            list += `<tr>
                <td>${++count}</td>
                <td>${broom.roomNo}</td>
                <td>${broom.user}</td>
                <td>${broom.checkIn}</td>
                <td>${broom.checkOut}</td>
                <td>${broom.NoDays}</td>
                <td>${broom.totPrice}</td>
                <td><i class="fa-solid fa-thumbs-up" onclick="approve(${broom.roomNo})"></i></td>
                </tr>`;
        }
    }
    dispBooking.innerHTML = list;
}

function approve(roomNo) {
    if (confirm("Approve Booking?.")) {
        for (let broom of bookedRooms) {
            if (broom.roomNo == roomNo) {
                broom.isApproved = true;
                for(let user of users){
                    if(user.email==broom.user){
                        user.noRooms+=1;
                        localStorage.setItem("users",JSON.stringify(users));
                    }
                }
                localStorage.setItem("bookedRooms", JSON.stringify(bookedRooms));
                document.querySelector(".error").style.display = "block"
                document.querySelector(".error").innerHTML = "Approved Successfully!...";
                document.querySelector(".error").style.color = "green";
                setTimeout(() => location.href = "/html/viewbooking.html", 500);
                break;
            }
        }
    }

}

function displayBookings() {
    let list = "";
    let count = 0;
    for (let broom of bookedRooms) {
        list += `<tr>
            <td>${++count}</td>
            <td>${broom.roomNo}</td>
            <td>${broom.user}</td>
            <td>${broom.checkIn}</td>
            <td>${broom.checkOut}</td>
            <td>${broom.NoDays}</td>
            <td>${broom.totPrice}</td>
            <td>${broom.isApproved}</td>
            </tr>`;
    }
    dispBooking.innerHTML = list;
}
