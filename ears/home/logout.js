

export const logout = ()=>{
    const logout = document.querySelector("#logout-button");
    logout.addEventListener("click", (e)=>{
        window.location.href = "../auth/login.html";
        sessionStorage.removeItem("user");
    })
}