const { getDB } = require("../database");

    const UserLogin = async (req, res) => {
        try {
            console.log("UserLogin: Calling getDB()");
            const db = getDB();
            console.log("UserLogin: db instance from getDB():", db ? "db object" : "undefined/null");

            if (!db) {
                console.error("UserLogin: DB instance is not available!");
                return res.status(500).json({ message: "Database connection error. DB not initialized." });
            }

            console.log("Login attempt with email:", req.body.email);
            console.log("Login attempt with password:", req.body.password);

            const query = {
                email: req.body.email,
                password: req.body.password
            };
            const result = await db
                .collection('users')
                .find(query)
                .toArray();
            console.log("Login query result length:", result.length);

            if(result.length >0){
                res.status(200).json("Account Authorized");
            }else {
                res.status(404).json("Account Not Found");
            }
        } catch(error){
            console.error("Error in UserLogin:", error);    
            res.status(400).json("Error Found in Cluster");
        }
    }

    module.exports = {UserLogin};