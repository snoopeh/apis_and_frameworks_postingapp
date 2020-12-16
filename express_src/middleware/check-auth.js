const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "hG2]vX2<7@/47K5~JBH!wn");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId}
    next();
  } catch (error) {
    result.status(401).json({message:"User not authenticated."});
  }
};
