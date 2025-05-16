const HOST = "https://ears-app-1cada786efcd.herokuapp.com";

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

export const AccountInfo = async (user) => {
    const details = {};
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
   
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        // For development, return static content
        details.result = {
            email: user,
            name: "John Doe",
            role: "Employee",
            department: "Engineering",
            mcompleted: 1,
            avgscore: 85,
            courses: [
                {
                    title: "Introduction to Computer Science",
                    progress: 30,
                    completed_modules: 1,
                    total_modules: 3
                }
            ]
        };
        return details;
    } catch (error) {
        details.result = 0;
        return details;
    }
};


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

export const GetCourse = async (email, courseTitle) => {
    const details = {};
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        // Fetch from backend
        const response = await fetch(`${HOST}/ears/info/course?email=${encodeURIComponent(email)}&courseTitle=${encodeURIComponent(courseTitle)}`, requestOptions);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            console.error(`Error fetching course ${courseTitle}: ${response.status}`, errorData);
            throw new Error(`Failed to load course: ${errorData.error || response.statusText}`);
        }
        details.result = await response.json();
        return details;
    } catch (error) {
        console.error("Error in GetCourse:", error);
        // Return a structure that the frontend can handle for errors
        details.error = error.message || "Failed to fetch course data.";
        details.result = null; // Ensure result is null on error
        return details;
    }
};

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
        // Fetch from backend
        const response = await fetch(`${HOST}/ears/info/courselist`, requestOptions);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            console.error(`Error fetching course list: ${response.status}`, errorData);
            throw new Error(`Failed to load course list: ${errorData.error || response.statusText}`);
        }
        details.result = await response.json(); // Expecting an array of courses
        return details;
    } catch (error) {
        console.error("Error in GetCourseList:", error);
        details.error = error.message || "Failed to fetch course list.";
        details.result = null; // Ensure result is null on error
        return details;
    }
};

export const UpdateModuleProgress = async (user, moduleId, progress) => {
    const details = {};
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
        email: user,
        moduleId: moduleId,
        progress: progress
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${HOST}/ears/progress/update`, requestOptions);
        details.result = await response.json();
        return details;
    } catch (error) {
        details.result = 0;
        return details;
    }
};

export const MarkModuleComplete = async (user, moduleId) => {
    const details = {};
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
        email: user,
        moduleId: moduleId
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${HOST}/ears/progress/complete`, requestOptions);
        details.result = await response.json();
        return details;
    } catch (error) {
        details.result = 0;
        return details;
    }
};