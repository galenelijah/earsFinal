import { AccountInfo } from "../Utilities/api.js";
import { modules, shome, sprofile } from "./static.js";


const getUser = () =>{
    return sessionStorage.getItem("user");
}    

const dashboard = document.querySelector(".dashboard button");
const profile = document.querySelector(".profile button");
const progress = document.querySelector(".progress button");
const tm = document.querySelector(".training-modules button");
const support = document.querySelector(".support button");

const clearActiveClass = ()=>{
    const links = document.querySelectorAll("li");
    links.forEach((el) =>{
        el.classList.remove("active");
    })
}
window.addEventListener("DOMContentLoaded",async (e) =>{
    await updateDashboard();
})
const updateDashboard = async () => {
        clearActiveClass();
    document.querySelector(".dashboard").classList.add("active");
    const content = document.querySelector(".content");
    content.classList.remove("cardContainer");
    content.innerHTML = shome;
    const details = (await AccountInfo(getUser())).result;
    const mcompleted = document.querySelector("#modules-completed");
    const avg = document.querySelector("#average-score");
    mcompleted.textContent = details.mcompleted;
    avg.textContent = details.avgscore + "%";
    history.pushState({}, "", "dashboard");
}
dashboard.addEventListener("click", async (e) =>{
    e.preventDefault();
    updateDashboard();
})

profile.addEventListener("click", async (e) =>{
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".profile").classList.add("active");
    const content = document.querySelector(".content");
    content.classList.remove("cardContainer");
    content.innerHTML = sprofile;
    const details = (await AccountInfo(getUser())).result;
    const obj = {
        name:"",email:"", gender:"",address:""
    }
    for(const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const doc = document.querySelector(`#${key}`);
            doc.innerHTML = "";
            const str =document.createElement("strong");
            str.textContent = `${key.toUpperCase()}: `; 
            doc.appendChild(str);
            doc.innerHTML += `${details[key]}`
            
        }
    }
        history.pushState({}, "", "profile");

})


tm.addEventListener("click", (e) => {
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".training-modules").classList.add("active");
     const container = document.querySelector(".employee-dashboard-layout")
     container.removeChild(document.querySelector('.main-content-area'));
     const temp = document.createElement("div");
     temp.classList.add("main-content-area")
     temp.innerHTML = modules;
     container.appendChild(temp);
});
