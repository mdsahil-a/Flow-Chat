const loginButton=document.querySelector("#loginButton");
const url="https://chat-app-s-server.onrender.com"


loginButton.addEventListener("click",async(event)=>{
event.preventDefault();
 
const email=document.querySelector("#email").value;
const password=document.querySelector("#password").value;
try{
const response=await axios.post(`${url}/api/auth/login`,
    {
        email,
        password
    }
);

localStorage.setItem("token", response.data.token);
  

   await showToast(response.data.message,"success");

   window.location='chatPage.html';

}
catch(error){
    showToast(error.response?.data?.message || error.message,"error");
}
});


