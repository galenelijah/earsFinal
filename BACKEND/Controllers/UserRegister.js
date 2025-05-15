const { getDB } = require("../database");

    const UserRegister = async (req, res) => {
        try {
            console.log("UserRegister: Calling getDB()");
            const db = getDB();
            console.log("UserRegister: db instance from getDB():", db ? "db object" : "undefined/null");

            if (!db) {
                console.error("UserRegister: DB instance is not available!");
                return res.status(500).json({ message: "Database connection error. DB not initialized." });
            }

            // Duplicate Accounts
            // Problem: Multiple users can register with the same email or username.
            db.collection('users').createIndex({ email: 1 }, { unique: true });
            try {
                
                const query = {
                    email: { $eq: req.body.email},
                    password: { $eq: req.body.password  },
                    name: {$eq: req.body.name}
                };
                const result = await db
                    .collection('users')
                    .insertOne(query);
                if(result.acknowledged){
                    res.status(200).json("User Succesfully Made");
                }else {
                    res.status(404).json("Something went wrong");
                }
            } catch (error) {
                res.status(404).json("Account Already Exists.");
                console.error(error);
            }

        } catch(error){
            console.error("Error in UserRegister:", error);    
            res.status(400).json("Something went wrong in accessing cluster...");
        }
    }

    module.exports = {UserRegister};