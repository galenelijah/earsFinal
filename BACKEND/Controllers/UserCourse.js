const { getDB } = require("../database");

const UserCourse = async (req, res) => {
  try {
    const db = getDB();
    
    // Correct query to find both user and specific course
    const result = await db.collection("info").findOne({
      email: req.query.email,
      "courses.title": req.query.courseTitle
    }, {
      projection: {
        "courses.$": 1  // Returns only the matching course element
      }
    });

    if (!result || !result.courses || result.courses.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(result.courses[0]);

  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

module.exports = { UserCourse };