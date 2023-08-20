import jwt from "jsonwebtoken";
import { generateTokens } from "../controllers/authController.js"

export const requireLogin = (req, res, next) => {
  console.log("REQUIRE LOGIN MIDDLEWARE");
  const token = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if(!token) return res.status(401).send("No token provided.");
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, (err, user) => {
        if (err) {
            console.log(err);
            console.log("Both access and refresh tokens are invalid.")
            return res.status(403).send({
                  message: "Both access and refresh tokens are invalid.",
            });
        }else{
          generateTokens(user, (err, tokens) => {
              if (err) {
                console.log("Error generating tokens for refresh on middleware.")
                console.log(err);
                return res.status(500).send("Error generating tokens.");
              }
              res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
              res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
              next();
          });
        }
        
      });
    }else{
      next();
    }
  }
  );
};
