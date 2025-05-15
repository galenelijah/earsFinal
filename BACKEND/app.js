require("dotenv").config();
const cors = require("cors");
const express= require('express');
const {run} = require("./database");
const {userRouter} = require("./Routers/UserRouters");
const { InfoRouter } = require("./Routers/InfoRouters");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
run().catch(console.dir);

app.use(cors({ // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/ears", userRouter);
app.use("/ears", InfoRouter);
app.use(express.static(path.join(__dirname, '../ears')));

// Catch-all for client-side routing: serves dashboard.html for any GET request
// that doesn't match an API route (like /ears/...) or an existing static file.
app.get(/^\/(?!ears\/?).*$/, (req, res) => { // Excludes /ears and /ears/* from this catch-all
  res.sendFile(path.join(__dirname, '../ears/home/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
})
