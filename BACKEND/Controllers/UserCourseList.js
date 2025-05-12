const { getDB } = require("../database")


const UserCourseList = async (req, res) =>{
        const db = getDB();
        try {
            
            const courses = await db.collection("courses").find().toArray();
            res.status(200).json(courses);
        } catch (error) {
            res.status(400).json("Internal Server Error Found...")
        }
}   

module.exports = {UserCourseList};