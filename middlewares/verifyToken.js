const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized -invalid token" });
    req.userId = decoded.userID;

    next();
  } catch (error) {
    console.log("Error in verifyToken", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyToken;
