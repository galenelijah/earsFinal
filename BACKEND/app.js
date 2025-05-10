require("dotenv").config();
const cors = require("cors");
const express= require('express');
const {run} = require("./database");
const {userRouter} = require("./Routers/UserRouters");
const { InfoRouter } = require("./Routers/InfoRouters");
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
app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
})
