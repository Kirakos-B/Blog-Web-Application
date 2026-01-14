const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret123";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]; // Look for token in headers

  if (!token) return res.status(403).json("Token required");

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json("Invalid Token");
    req.user = decoded;
    next(); // Move to the next function (the actual route)
  });
};

module.exports = verifyToken;
