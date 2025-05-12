const HOST = "http://localhost:3000";

export const CheckLogin = async (user) =>{
  const details ={};
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "email": user.email,
    "password": user.password
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  try {
    const response = await fetch(`${HOST}/ears/users/login`, requestOptions);
    const text = await response.text();

    details.text = text;
    details.status = response.status;
  } catch (error) {
    details.text = "Connection To Server Not Found";
    details.status = 404; // or -1, since error object doesn't have a status
  }

  return details;
}

export const RegisterAccount = async (user) =>{
  const details ={};
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "email": user.email,
    "password": user.password,
    "name": user.name
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  try {
    const response = await fetch(`${HOST}/ears/users/register`, requestOptions);
    const text = await response.text();
    details.text = text;
    details.status = response.status;
  } catch (error) {
    details.text = "Connection To Server Not Found";
    details.status = 404; // or -1, since error object doesn't have a status
  }

  return details;
}

export const AccountInfo = async (user) =>{
    const details ={};
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
 
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  try {
    const response = await fetch(`${HOST}/ears/info?email=${user}`, requestOptions);
    details.result = await response.json();
  } catch (error) {
    details.result = 0
  }

  return details;
}


export const initAccount = async (user) =>{
  const details ={};
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "email": user.email,
    "name": user.name
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  try {
    const response = await fetch(`${HOST}/ears/info/create`, requestOptions);
    const text = await response.text();
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
}

export const GetCourse = async (user, courseTitle) =>{
    const details ={};
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
 
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  try {
    const response = await fetch(`${HOST}/ears/info/course?email=${user}&courseTitle=${courseTitle}`, requestOptions);
    details.result = await response.json();
  } catch (error) {
    details.result = 0
  }

  return details;
}


export const GetCourseList = async () =>{
    const details ={};
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
 
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  try {
    const response = await fetch(`${HOST}/ears/info/courselist`, requestOptions);
    details.result = await response.json();
  } catch (error) {
    console.log(error);
    details = 0;
  }
  return details;
}