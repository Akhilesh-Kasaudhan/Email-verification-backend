const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 900000).toString();
};

module.exports = generateVerificationCode;
