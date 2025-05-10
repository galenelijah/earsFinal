const {getDB} = require("../database");
const UserList = async (req, res) =>{
    const db = getDB();
    try{
        const users = await db.collection("users").find().limit(10).toArray();
        res.status(200).json(users);
    }catch(err){
        console.log(err);
        res.status(400).json("Error Found in Cluster");
    }
        

}


module.exports = {UserList}