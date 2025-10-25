const res_sec=document.querySelector("#toast-container");
function showToast(message,type){
  
  res_sec.textContent=message;
  res_sec.style.color=type==="success"?"green":"red";
res_sec.style.display="block";

setTimeout(() => {
  res_sec.style.display="none";
}, 1500);

    }
