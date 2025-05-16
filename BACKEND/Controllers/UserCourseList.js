const { getDB } = require("../database")

const UserCourseList = async (req, res) =>{
    const db = getDB();
    if (!db) {
        console.error("UserCourseList: Database not connected!");
        return res.status(500).json({ error: "Database connection has not been established." });
    }
    try {
        console.log("UserCourseList: Fetching courses from DB...");
        const courses = await db.collection("courses").find().toArray();
        console.log(`UserCourseList: Found ${courses.length} courses.`);
        res.status(200).json(courses); // courses should be an array
    } catch (error) {
        console.error("UserCourseList: Error fetching courses:", error);
        res.status(500).json({ error: "Internal Server Error while fetching courses.", details: error.message });
    }
}   

module.exports = {UserCourseList};