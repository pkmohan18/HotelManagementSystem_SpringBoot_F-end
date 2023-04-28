dispUsers = document.getElementById("disp-users");

async function display() {
    let resp = await fetch("http://localhost:8080/user/get");
    if(resp.status==200){
        let users = await resp.json();
        let list = "";
        let count = 0;
        for (let user of users) {
            list += `<tr>
            <td>${++count}</td>
            <td>${user.fname + " " + user.lname}</td>
            <td>${user.email}</td>
            <td>${user.phno}</td>
            <td>${user.noRooms}</td>
            <td><i class="fa-solid fa-trash" onclick="delUser('${user.id}')"></i></td>
            </tr>`;
        }
        dispUsers.innerHTML = list;
    }
}

async function delUser(id) {
    let resp = await fetch("http://localhost:8080/user/delete?id="+id,{
        method : "DELETE"
    });
    let msg = await resp.text();
    message(msg);
    location.reload();
}

let roomNo = document.getElementById("room-no");
let roomType = document.getElementById("room-type");
let capacity = document.getElementById("capacity");
let price = document.getElementById("price");
let btn = document.getElementById("btn");
let isAvailable = document.getElementById("available");

let dispRooms = document.getElementById("disp-rooms");

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
    checkRooms();
});

async function checkRooms(){
    if (btn.value == "Update")
            updateRooms(roomNo.value);
    else{
        let resp = await fetch("http://localhost:8080/room/getByNo?num="+roomNo.value);
        if(resp.status==200){
            message("Room with this Room No Already Exists!...");
        }
        else
            addRooms();
    }
}

async function addRooms() {
    let room = {
        roomNo: roomNo.value,
        roomType: roomType.value,
        capacity: capacity.value,
        price: price.value,
        isAvailable: isAvailable.checked,
    };
    let resp = await fetch("http://localhost:8080/room/save",{
        method :'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(room),
    })
    message("Room added successfully!...", true);
    setTimeout(() => location.reload(), 500);
}

async function displayRooms() {
    let resp = await fetch("http://localhost:8080/room/get");
    if(resp.status==200){
        let rooms = await resp.json();
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
            <td><i class="fa-solid fa-trash" onclick="delroom('${room.id}')"></i></td>
            </tr>`;
        }
        dispRooms.innerHTML = list;
    }
}

async function delroom(id) {
    let resp = await fetch("http://localhost:8080/room/delete?id="+id,{
        method : "DELETE"
    });
    let msg = await resp.text();
    message(msg);
    location.reload();
}

async function editroom(num) {
    let resp = await fetch("http://localhost:8080/room/getByNo?num="+num);
    let room = await resp.json();
    roomNo.value = room.roomNo;
    roomType.value = room.roomType;
    capacity.value = room.capacity;
    price.value = room.price;
    if (room.isAvailable)
        document.getElementById("available").checked = true;
    else
        document.getElementById("available").checked = false;
    btn.value = "Update";
}

async function updateRooms(num) {
    let resp = await fetch("http://localhost:8080/room/getByNo?num="+num);
    if(resp.status==200){
        let room = await resp.json();
        let roomUp = {
                id : room.id,
                roomNo : roomNo.value,
                roomType : roomType.value,
                capacity : capacity.value,
                price : price.value,
                isAvailable : isAvailable.checked,
        }
        await fetch("http://localhost:8080/room/save",{
        method :'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(roomUp),
        });
        message("Room updated successfully!...", true);
        setTimeout(() => location.reload(), 500);
    }
    else {
        message("Room No. does not exists!...");
    }
}

dispBooking = document.getElementById("disp-booking");

async function displayApprove() {
    let resp = await fetch("http://localhost:8080/bookedRoom/get");
    if(resp.status==200){
        let bookedRooms = await resp.json();
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
                    <td>${broom.noDays}</td>
                    <td>${broom.totPrice}</td>
                    <td><i class="fa-solid fa-thumbs-up" onclick="approve(${broom.roomNo})"></i></td>
                    </tr>`;
            }
        }
        dispBooking.innerHTML = list;
    }
}

async function approve(num) {
    let resp = await fetch("http://localhost:8080/bookedRoom/getByNo?num="+num);
    let broom = await resp.json();
    let resp1 = await fetch("http://localhost:8080/user/getByEmail?email="+broom.user);
    let user = await resp1.json();
    if (confirm("Approve Booking?.")) {
        broom.isApproved= true;
        await fetch("http://localhost:8080/bookedRoom/save",{
              method :'POST',
              headers : {
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json'
              },
              body: JSON.stringify(broom),
              });
        user.noRooms = user.noRooms+1;
        await fetch("http://localhost:8080/user/save",{
            method :'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user),
            });
        document.querySelector(".error").style.display = "block"
        document.querySelector(".error").innerHTML = "Approved Successfully!...";
        document.querySelector(".error").style.color = "green";
        setTimeout(() => location.href = "/html/viewbooking.html", 500);
    }

}

async function displayBookings() {
    let resp = await fetch("http://localhost:8080/bookedRoom/get");
    if(resp.status==200){
        let bookedRooms = await resp.json();
        let list = "";
        let count = 0;
        for (let broom of bookedRooms) {
            if(broom.isApproved){
                list += `<tr>
                    <td>${++count}</td>
                    <td>${broom.roomNo}</td>
                    <td>${broom.user}</td>
                    <td>${broom.checkIn}</td>
                    <td>${broom.checkOut}</td>
                    <td>${broom.noDays}</td>
                    <td>${broom.totPrice}</td>
                    <td>Booked</td>
                    </tr>`;
            }
            dispBooking.innerHTML = list;
        }
    }
}
