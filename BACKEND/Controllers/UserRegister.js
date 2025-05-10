const { getDB } = require("../database");

    const UserRegister = async (req, res) => {
        try {
            const db = getDB();
            // Duplicate Accounts
            // Problem: Multiple users can register with the same email or username.
            db.collection('users').createIndex({ email: 1 }, { unique: true });
            try {
                
                const result = await db.collection('users').insertOne({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name
                  });
                    res.status(200).json("Account Registered.");
            } catch (error) {
                res.status(404).json("Account Already Exists.");
                console.error(error);
            }

        } catch(error){
            console.log(error);    
            res.status(400).json("Something went wrong in accessing cluster...");
        }
    }

    module.exports = {UserRegister};