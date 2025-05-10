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

export const shome = ` <main class="content">
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
            </main>
            `

export const modules = 
`
            <header class="main-header">
                <div class="search-bar">
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="search" placeholder="Search training modules...">
                </div>
                <div class="user-info">
                     <i class="fa-regular fa-bell notification-icon"></i>
                    <span id="user-role">Employee</span>
                    <i class="fa-regular fa-circle-user user-icon"></i>
                    <button id="logout-button">Logout</button>
                </div>
            </header>

            <main class="content cardContainer">
                <div class="card">
                    <div class="card-content">
                        <h1>Title</h1>
                        <h2>Course Code</h2>
                        <h3>Description</h3>
                    </div>
                </div>
            </main>

            <footer>
                <p>&copy; 2025 EARS</p>
            </footer>
        `
