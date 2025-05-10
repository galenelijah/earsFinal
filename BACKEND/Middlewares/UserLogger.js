const userLogger = async (req, res, next) => {
    console.log("\n\nTYPE: " + req.method  + ";\nHOST: "+  req.get("host")+ ";\nIP: " + req.ip)
    next();
}

module.exports = {userLogger};