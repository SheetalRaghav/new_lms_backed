const jwt = require("jsonwebtoken");
const { userModel } = require("../db/db");

const getUserId = async (token) => {
  if (!token) throw new Error("Access Denied");

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyJwtToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) throw new Error("Pass the access token");

    const verified = await getUserId(token);

    req.user = await userModel.findById(verified.userId);
    if (req.user) {
      next();
    } else {
      return res.status(404).json({ error: { message: "User not found" } });
    }
  } catch (err) {
    if (err.message === "Access Denied") {
      return res.status(403).json({ error: { message: "Access Denied" } });
    }

    if (err.message === "Pass the access token") {
      return res.status(400).json({ error: { message: err.message } });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(410).json({ error: { message: err.message } });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: { message: err.message } });
    }

    res.status(500).json({ error: { message: err.message } });
  }
};

module.exports = { verifyJwtToken, getUserId };
