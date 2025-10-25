    const bio=document.querySelector("#bio");
    const p_name=document.querySelector("#profileName");
    const email=document.querySelector("#userName");
    const edit_button=document.querySelector('#edit');
    const edit_menu=document.querySelector(".edit_menu");
    const change_button=document.querySelector("#change_button");
    const picUploadButton=document.querySelector("#picUploadButton");
    const fileInput=document.querySelector("#fileInput");
    const currentPic=document.querySelector("#currentPic");


const url="https://chat-app-s-server.onrender.com"

window.onload=async()=>{
  const token=localStorage.getItem('token');

try{

 const res=await axios.post(`${url}/api/auth/checkAuth`,{token});
 userId=res.data._id;
 
 p_name.textContent=res.data.fullName;
 email.textContent=res.data.email;
currentPic.src=res.data.profilePic;

}

  catch(error){

console.log(error.message);
  }

}  

picUploadButton.addEventListener('click',()=>{
});
picUploadButton.addEventListener('click',()=>{
  fileInput.click();
})

edit_button.addEventListener("click",()=>{
  edit_menu.classList.toggle("hidden");
})

change_button.addEventListener('click', async (event)=>{
  event.preventDefault();
edit_menu.classList.add('hidden');
  const fileInput = document.querySelector("#fileInput");
  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);
  const token = localStorage.getItem("token");

   try {
 const response = await fetch(`${url}/api/auth/profile-update`,{
  method: "POST",
  headers: {
    Authorization: ` Bearer ${token}`, 
  },
  body: formData,
}
);
    
   const data = await response.json();
   console.log(data);
        if (!data.success) 
      alert("Upload failed!");
    currentPic.src=data.link;
      } catch (error) {
        console.error(error);
        alert("Error uploading image.");
      } 



  });