import jwt from "jsonwebtoken";

export const requireLogin = (req, res, next) => {
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).send("No token provided.");
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).send("Invalid access token.");
    }
    next();
  }
  );
};
