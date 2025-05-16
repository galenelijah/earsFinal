const userRouter = require("express").Router();
const {userLogger} = require("../Middlewares/UserLogger");
const {UserLogin} = require("../Controllers/UserLogin");
const {UserRegister} = require("../Controllers/UserRegister");
const {UserList} = require("../Controllers/UserList");
const {UserProgress} = require("../Controllers/UserProgress");

userRouter.use("/users",userLogger);
userRouter.post("/users/login",UserLogin);
userRouter.post("/users/register",UserRegister);
userRouter.get("/users/list", UserList);
userRouter.get("/users/progress", UserProgress);

module.exports = {userRouter};