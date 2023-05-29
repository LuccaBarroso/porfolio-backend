import jwt from "jsonwebtoken";

export function login(req, res) {
  const { username, password } = req.body;
  
  const user = {
      id: 0,
      username: username,
      role: "default",
  }

  if(username === process.env.ADMIN_USERNAME) {
      user.role = "admin";
      user.id = 1;
      if(password !== process.env.ADMIN_PASSWORD) {
          res.status(401).send("Invalid credentials");
      } else {
          generateTokens(user, (err, tokens) => {
              if (err) {
                  console.log(err);
                  return res.status(500).send("Error generating tokens.");
              }
              res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
              res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
              res.status(200).send("Logged in!");
          });
      }
  }

  // LOGIC FOR REGULAR USERS WILL GO HERE, IF ONE DAY I DECIDE IT'S WORTH IT
  return res.status(401).send("Invalid credentials");
}

export function logout(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).send("Logged out!");
}

export function refreshLogin(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
      return res.status(401).send("No refresh token provided.");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, (err, user) => {
      if (err) {
          console.log(err);
          return res.status(403).send("Invalid refresh token.");
      }
      
      generateTokens(user, (err, tokens) => {
          if (err) {
              console.log(err);
              return res.status(500).send("Error generating tokens.");
          }
          res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
          res.status(200).send("Refreshed access token!");
      });
  });
}

export function getCurrentUser(req, res) {
  const token = req.cookies.accessToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
      if (err) {
          console.log(err);
          return res.status(403).send("Invalid access token.");
      }
      const filteredUser = {
          id: user.id,
          username: user.username,
          role: user.role,
      };
      res.status(200).json(filteredUser);
  }
  );
}



const generateTokens = (user, callback) => {
  try {
      const payload = { id: user.id, username: user.username, role: user.role };
      const accessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_PRIVATE_KEY,
          { expiresIn: "14m" }
      );
      const refreshToken = jwt.sign(
          payload,
          process.env.REFRESH_TOKEN_PRIVATE_KEY,
          { expiresIn: "30d" }
      );

      return callback(null, { accessToken, refreshToken });
  } catch (err) {
      return callback(err, null);
  }
};