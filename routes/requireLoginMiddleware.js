import jwt from "jsonwebtoken";

export const requireLogin = (req, res, next) => {
  const reqToken = req.headers.authorization;
  if (!reqToken) return res.status(401).send("No token provided.");
  const token = req.headers.authorization.split(" ")[1];
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
