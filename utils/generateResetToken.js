const crypto = require("crypto");

const generateResetToken = (req, res) => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

  return { resetToken, resetTokenExpiresAt };
};

module.exports = generateResetToken;
