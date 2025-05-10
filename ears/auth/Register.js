import { RegisterAccount } from "../Utilities/api.js";



const form = document.getElementById("register-form");

const email = document.getElementById("email");
const data = {};

const emailValidity = () => {
    email.setCustomValidity(""); // reset before checking
    if (email.validity.valueMissing) return -1;
    if (email.validity.typeMismatch || email.validity.patternMismatch) return 0;
    return 1;
};


const send = async (formData)=>{
    formData.forEach((value, key) => {
      data[key] = value;
    })
    const details = await RegisterAccount(data);
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
    }
}
form.addEventListener("submit", async (e) =>{
    e.preventDefault(); // Prevent page refresh
    const formData = new FormData(form);
    let res = emailValidity();
    await send(formData);
});

