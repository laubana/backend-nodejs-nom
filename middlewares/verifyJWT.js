const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "9aq~&_8F<Qq=>EZzwhWFE=DJ$dI+<T",
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.id = decoded.UserInfo.id;
      req.user = decoded.UserInfo.email;
      req.role = decoded.UserInfo.role;

      if (req.role == "consumer") {
        req.consumerId = decoded.UserInfo.consumerId;
      } else if (req.role === "merchant") {
        req.merchantId = decoded.UserInfo.merchantId;
      }
      next();
    }
  );
};

module.exports = verifyJWT;
