const { getDB } = require("../database")


const UserInfo = async (req, res) =>{
    const db = getDB();
            const query = {
                email: { $eq: req.query.email}
            };
        const users = await db.collection("info").find().toArray();
        res.status(200).json(users[0]);
}

module.exports = {UserInfo};