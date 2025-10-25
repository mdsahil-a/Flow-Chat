const groupWrapper=document.querySelector(".groupWrapper");
const friendWrapper=document.querySelector(".friendWrapper");
const authorImage=document.querySelector("#authorImage");
const search=document.querySelector("#search");
const result=document.querySelector(".result");
const userName=document.querySelector("#userName");
const userPic=document.querySelector("#userPic");
const send=document.querySelector(".send");
const logout=document.querySelector(".logout");
const logoutPage=document.querySelector(".logoutPage");
const logoutYes=document.querySelector("#logoutYes");
const logoutNo=document.querySelector("#logoutNo");
const noti_list=document.querySelector(".noti_list");
const userPage=document.querySelector(".userPage");
const chatBox=document.querySelector(".chatBox");


// const noti_icon=document.querySelector("#notiIcon");
// const home=document.querySelector("#homeIcon");
const navItems=document.querySelectorAll(".nav-item");
const url="https://chat-app-s-server.onrender.com"
pages=document.querySelectorAll(".page");
let currentPage;
navItems.forEach(item=>{
item.addEventListener("click",()=>{
 navItems.forEach(i=> i.classList.remove('active'));
 pages.forEach(page=>page.classList.add("hidden"));
  logoutPage.classList.add("hidden");

 item.classList.add("active");
if(item.dataset.page=="logout"){
  return ;
}
        document.getElementById(item.dataset.page).classList.remove('hidden');
        document.querySelector(".userPage").classList.remove("hidden");

})
  
})


function showPeoples(){
chatBox.classList.add("hide");
  userPage.classList.remove("hide");



}
const date=new Date();
// console.log(`${date.getHours()}:${date.getMinutes()}${date.getHours()>12?"pm":"am"}`);
const i=document.querySelectorAll("i");


const socket=io(url);

let userId;




logout.addEventListener("click",()=>{
logoutPage.classList.toggle("hidden");
});
  
logoutYes.addEventListener("click",()=>{
  localStorage.setItem("token","");
  window.location="loginPage.html";
});

logoutNo.addEventListener("click",()=>{
  logoutPage.classList.add("hidden");
})


window.onload=async()=>{

const token=localStorage.getItem('token');
try{
  if(!token){
    window.location='loginPage.html';
    return;
  }
const res=await axios.post(`${url}/api/auth/checkAuth`,{token});
 userId= res.data._id;
 authorImage.src=res.data.profilePic;


        

}
catch(error){

    console.log("Error ",error.message);
}


loadusers();
socket.emit("join",userId);
}

authorImage.addEventListener("click",()=>{
    window.location='profilePage.html'
});


search.addEventListener("input",async()=>{

 const name=document.querySelector("#search").value;
if(name==""){
  result.style.display="none";
}
else{
  result.style.display="inline";
}

try{
 const res=await axios.post(`${url}/api/friend/search`,{name});

 const users=res.data;
result.innerHTML="";
users.forEach(user=>{

    result.innerHTML+=`
    <div class="peoples">
<div class="peopleDetails">
  <img src="${user.profilePic}" id="peopleImage" alt="">
  <span>${user.fullName}</span>
</div>
<button id="sendMessage" onclick="addUser('${user._id}')">Message</button>
</div>
    `


});



}

catch(error){
    console.log(error.message);
}

});


const addUser=async (receiverId)=>{
console.log(userId)
    try{
const res=await axios.post(`${url}/api/friend/send`,{userId,receiverId});

sendNotification(receiverId);
    }
    catch(error){
        console.log(error.message);

    }


}

const loadusers=async()=>{
const res=await axios.post(`${url}/api/friend/getUsers`,{userId});
const users=res.data;

users.forEach(user=>{

   const id=userId==user.sender?user.receiver:user.sender;
   findUser(id).then(details=>{

    friendWrapper.innerHTML+=`

    <div class="friend " onclick="appenChat('${id}','${details.data.fullName}','${details.data.profilePic}','${details.data.isOnline}')">
  <div class="friendDetails">
<img src="${details.data.profilePic}" alt="" id="friendImage">
<div class="friendInfo">
  <span id="friendName">${details.data.fullName}</span>
  <span id="friendRecentMessage">Alright</span>
</div>
  </div>
  <span id="friendMessageDate">Monday,7:12pm</span>
</div>
    `

   });

})
}



const findUser=async(id)=>{
try{
    const res=await axios.post(`${url}/api/auth/find`,{id});
 
    return res;
}
catch(error){
    console.log(error.message);
}

}

const appenChat=async(id,name,pic,status)=>{
console.log(status)
userPage.classList.add("hide");
chatBox.classList.remove("hide");


document.querySelector(".chatBox").innerHTML=`
<div class="chatNav">

  <div class="userDetails">
<img src=${pic} alt="" id="userPic">

<div class="userInfo">
  <span id="userName">${name}</span>
  <span id="status">${status=='true'?"Online":"Offline"}</span>
</div>
  </div>

  <div class="options">
    <span id="call"><i class="fa-solid fa-phone-volume"></i></span>
    <span id="v-call"><i class="fa-solid fa-video"></i></span>
    <span id="more"><i class="fa-solid fa-bars"></i></span>
  </div>
</div>

<div class="messageDiv">


</div>


<div class="inputDiv">

  <input type="text" class="inputMessage" placeholder="Type message...">
  <button class="send" onclick="sendMessage('${id}')"><i class="fa-solid fa-paper-plane"></i></button>
</div>
`
// socket.on("updateUserStatus", ({ userId, isOnline, lastSeen }) => {

//   if (isOnline) {
//     el.innerText = "🟢 Online";
//   } else {
//     el.innerText = "Last seen: " + new Date(lastSeen).toLocaleString();
//   }
// });

loadChat(id);

}



function sendMessage(receiverId){
    const senderId=userId
    const msg=document.querySelector(".inputMessage").value;

    socket.emit("sendMessage",{senderId,receiverId,msg});
    document.querySelector(".inputMessage").value="";
}

socket.on("receiveMessage",(msg)=>{
console.log(msg);
             const currentTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const messageDiv= document.querySelector(".messageDiv");
  const user=userId==msg.sender?"sender":"reciever";
  const userDate=userId==msg.sender?"senderDate":"recieverDate";
  console.log(user)
  messageDiv.innerHTML+=`<div class="${user}">
  <span id="${user}">${msg.message}</span>
  <span id="${userDate}">${currentTime}</span>
</div>`

})

const loadChat=async(id)=>{

    try{
        const res=await axios.post(`${url}/api/message/loadMessage`,{userId,id});
        const messages=res.data;
        messages.forEach(message=>{
             const currentTime = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          console.log(currentTime)
    const messageDiv= document.querySelector(".messageDiv");
  const user=userId==message.sender?"sender":"reciever";
  const userDate=userId==message.sender?"senderDate":"recieverDate";
 
  messageDiv.innerHTML+=`<div class="${user}">
  <span id="${user}">${message.message}</span>
  <span id="${userDate}">${currentTime}</span>
</div>`
        })
    
    }
    catch(error){
        console.log(error.message);

    }

}


// socket.on("updateUserStatus", ({ userId, isOnline }) => {
//   const el = document.getElementById(`status-${userId}`);
//   if (isOnline) {
//     el.innerText = "🟢 Online";
//   } else {
//     el.innerText = "🔴 Offline";
//   }
// });


const loadNotification=async()=>{

  try{
const res=await axios.post(`${url}/api/auth/loadNotification`,{userId})
console.log(res.data);
if(res.data.length==0){
  return ;
}

res.data.forEach(noti=>{
  noti_list.innerHTML=`  <div class="noti_card" onclick="deleteNotification('${noti._id}')">
    <img src="../../public/avatar.jpeg" alt="" id="noti_user">
    <div class="noti_details">
      
      <span id="noti_user">${noti.userName}</span>
      <span id="noti_message">: Added you</span>
    </div>
    <span id="noti_date">7:05am</span>
</div>`
})


  }
  catch(error){
    console.log(error.message);
  }
  
}

const sendNotification=async(recieverId)=>{
const message="Added you"

  try{

    const res=await axios.post(`${url}/api/auth/sendNotification`,{userId,recieverId,message});

  }
  catch(error){
    console.log(error.message);

  }

}

// const deleteNotification=async(id)=>{

// try{

//   const res=await axios.post("http://localhost:3000/api/auth/deleteNotification",{id});
//   console.log(res.data.message);
//   loadNotification();
// }
// catch(error){
//   console.log(error.message);
// }

// }