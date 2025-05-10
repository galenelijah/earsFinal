const { getDB } = require("../database");

    const UserLogin = async (req, res) => {
        try {
            const db = getDB();
            const query = {
                email: { $eq: req.body.email},
                password: { $eq: req.body.password  }
            };
            const result = await db
                .collection('users')
                .find(query)
                .toArray();
                console.log(result.length);
            if(result.length >0){
                res.status(200).json("Account Authorized");
            }else {
                res.status(404).json("Account Not Found");
            }
        } catch(error){
            console.log(error);    
            res.status(400).json("Error Found in Cluster");
        }
    }

    module.exports = {UserLogin};