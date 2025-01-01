const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userID) => {
  const token = jwt.sign({ userID }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  let options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  };
  return { token, options };
};

module.exports = generateTokenAndSetCookie;
