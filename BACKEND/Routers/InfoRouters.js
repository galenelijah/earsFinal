const { UserAddress } = require("../Controllers/UserAddress");
const { UserAverage } = require("../Controllers/UserAverage");
const { UserCompleted } = require("../Controllers/UserCompleted");
const { UserGender } = require("../Controllers/UserGender");
const { UserInfo } = require("../Controllers/UserInfo");
const { UserName } = require("../Controllers/UserName");
const InfoRouter = require("express").Router();


InfoRouter.get("/info", UserInfo);
InfoRouter.get("/info/name", UserName);
InfoRouter.get("/info/avg", UserAverage);
InfoRouter.get("/info/gen", UserGender);
InfoRouter.get("/info/addr", UserAddress);
InfoRouter.get("/info/mcomp", UserCompleted);


module.exports = {InfoRouter};