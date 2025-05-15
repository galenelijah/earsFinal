require("dotenv").config();
const cors = require("cors");
const express = require('express');
const { run } = require("./database"); 
const { userRouter } = require("./Routers/UserRouters");
const { InfoRouter } = require("./Routers/InfoRouters");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Function to start the server
const startServer = () => {
  app.use(cors({ 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json()); 
  app.use(express.urlencoded({ extended: true }));

  app.use("/ears", userRouter);
  app.use("/ears", InfoRouter);
  
  app.use(express.static(path.join(__dirname, '../ears')));

  app.get(/^\/(?!ears\/?).*$/, (req, res) => { 
    res.sendFile(path.join(__dirname, '../ears/home/dashboard.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
    console.log("Application is ready.");
  });
};

// Connect to DB and then start server
run()
  .then(() => {
    console.log("Database connected successfully.");
    startServer(); 
  })
  .catch(err => {
    console.error("Failed to connect to the database. Server not started.", err);
    process.exit(1); 
  });
