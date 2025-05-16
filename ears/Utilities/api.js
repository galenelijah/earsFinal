const HOST = "";

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


export const GetCourseList = async () => {
    const details = {};
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
   
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        console.log('Fetching course list...');
        const response = await fetch(`${HOST}/ears/info/courselist`, requestOptions);
        console.log('Course list response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Course list data:', data);
        
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid data format received');
        }
        
        details.result = data;
    } catch (error) {
        console.error('Error fetching course list:', error);
        details.result = null;
        details.error = error.message;
    }
    
    return details;
}