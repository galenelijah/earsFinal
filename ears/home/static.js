export const sprofile = `
        <h1>User Profile</h1>
        <section class="profile-section">
          <div class="profile-card">
            <h2>Account Information</h2>
            <div class="profile-info">
              <p id="name"><strong>Name:</strong> John</p>
              <p id="email"><strong>Email:</strong> 23101961@usc.edu.ph</p>
              <p id="gender"><strong>Gender:</strong> Male</p>
              <p id="address"><strong>Address:</strong> Mactan Plains Residences</p>
            </div>
          </div>
        </section>`;

export const shome = `
                <h1>Training Dashboard</h1>

                <section class="module-overview">
                    <div class="module-card">
                        <h3>POS Basics Training</h3>
                        <p>0% Complete</p>
                        <a href="#" class="button play-button"><i class="fa-solid fa-play"></i></a>
                    </div>
                    <div class="module-card">
                        <h3>Customer Service Essentials</h3>
                        <p>0% Complete</p>
                         <a href="#" class="button play-button"><i class="fa-solid fa-play"></i></a>
                    </div>
                    <!-- Add more module cards as needed -->
                </section>

                <section class="performance-summary">
                    <h2>Your Performance</h2>
                    <div class="performance-metrics">
                        <div class="metric">
                            <span class="value" id="modules-completed">6</span>
                            <span class="label">Modules Completed</span>
                        </div>
                        <div class="metric">
                            <span class="value" id="average-score">NaN%</span>
                            <span class="label">Average Score</span>
                        </div>
                    </div>
                </section>
            `

export const modules = 
`<main class="content cardContainer">
                <div class="card">
                    <div class="card-content">
                        <h1>Title</h1>
                        <h2>Course Code</h2>
                        <h3>Description</h3>
                    </div>
                </div>
            </main>`



        // const module = {
        //     body:"Module Empty..."
        // }
        // const question = {
        //     problem:"Problem is empty...",
        //     choices:[],
        //     answer: ""
        // }
        // const quiz = {
        //     questions:[],
        //     score:0
        // }
        // const course = {
        //         title:"",
        //         modules:[],
        //         quizzes:[]
        //     }

        // const courses = []


        const courses = [
  {
    title: "Introduction to Computer Science",
    modules: [
      { 
        title: "Computer Science Fundamentals",
        body: "Overview of algorithms, data structures, and computational thinking." 
      },
      { 
        title: "Programming Basics",
        body: "Variables, data types, and control structures in Python/JavaScript." 
      },
      { 
        title: "Web Development",
        body: "HTML/CSS fundamentals and client-server architecture." 
      }
    ],
    quizzes: [
      {
        questions: [
          {
            problem: "What does CPU stand for?",
            choices: ["Central Processing Unit", "Computer Processing Unit", "Central Program Utility", "Core Processing Unit"],
            answer: "Central Processing Unit"
          },
          {
            problem: "Which language is used for styling web pages?",
            choices: ["HTML", "CSS", "JavaScript", "Python"],
            answer: "CSS"
          },
          {
            problem: "What is the output of `print(3 * 'a')` in Python?",
            choices: ["aaa", "3a", "a3", "Error"],
            answer: "aaa"
          }
        ],
        score: 0
      }
    ]
  }]