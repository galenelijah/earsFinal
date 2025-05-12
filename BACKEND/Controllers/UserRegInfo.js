const { getDB } = require("../database")

const UserRegInfo = async (req, res) =>{

    try {
    const db = getDB();
        const courses = await db.collection('courses').find().toArray();
        const list =[];
        for(let i = 0; i < courses.length; i++) {
            const {_id, ...rest} = courses[i];
            list.push(rest);
        }
        const tmpl = {
        email: req.body.email,
        name: req.body.name || "Tom",
        gender: "Male",
        address: "N/A", 
        mcompleted:0,
        avgscore:0,
        admin:false,
        courses:list.length ? list : []
        }
        const result = await db.collection('info').insertOne(tmpl);
        res.status(200).json("Account Information Registered...");
    } catch (error) {
         console.log(error.errorResponse)
        res.status(400).json("Something went wrong in registering account...")
    }
}

module.exports = {UserRegInfo};