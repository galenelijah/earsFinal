import { CheckLogin } from "../Utilities/api.js";

const form = document.getElementById("login-form");

const data = {};

form.addEventListener("submit", async (e) =>{
    e.preventDefault(); // Prevent page refresh
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      data[key] = value;
    })
    const details = await CheckLogin(data);
    const status = details.status;
    const text = details.text;

    if(status != 200){
      console.error("Status: "+ status+"\nResponse: "+text)
      alert("ERROR"+"\nStatus: "+ status+"\nResult: "+text)
    }else if(status == 400){
      console.error("Status: "+ status+"\nResponse: "+text)
      alert("ERROR"+"\nStatus: "+ status+"\nResult: "+text)
    }else {
      console.log("Status: "+ status+"\nResponse: "+text)
      alert("Status: "+ status+"\nResult: "+text)
const durationMinutes = 30;
const now = new Date().getTime(); // milliseconds
const expiresAt = now + durationMinutes * 60 * 1000;

    sessionStorage.setItem("user", data.email);

    // Set the logged-in flag
    sessionStorage.setItem('isUserLoggedIn', 'true');

    setTimeout(() => {
      window.location.href = "../home/dashboard.html"
  }, 2000);
}
});


