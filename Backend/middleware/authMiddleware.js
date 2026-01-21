const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret123";

const verifyToken = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.headers["authorization"];

  // 2. Handle both "Token" and "Bearer Token" formats
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token) {
    return res.status(403).json("Access denied. No token provided.");
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json("Token is invalid or expired.");
    }

    // 3. Attach the decoded payload (id, role, etc.) to the request object
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  // verifyToken must run before this to populate req.user
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json("Permission denied. Admin rights required.");
  }
};

module.exports = { verifyToken, isAdmin };
