const { getDB } = require("../database")


const UserName = async (req, res) => {
  try {
    const db = getDB();
    const filter = { email: {$eq: req.query.email} };
    const update = { $set: { name: req.query.name } };
    const result = await db.collection("info").updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes made" });
    }

    // Optional: return the updated document
    const updatedUser = await db.collection("info").findOne(filter);
    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(400).json({ error: "Internal server error", details: error.message });
  }
};

module.exports = {UserName};