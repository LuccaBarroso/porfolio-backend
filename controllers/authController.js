import jwt from "jsonwebtoken";

export function login(req, res) {
    const { username, password } = req.body;
    const user = {
      id: 0,
      username: username,
      role: "default",
    }
  
    if (username === process.env.ADMIN_USERNAME) {
      user.role = "admin";
      user.id = 1;
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).send({
          message: "Invalid credentials",
        });
      } else {
        console.log("Logged in as admin");
        generateTokens(user, (err, tokens) => {
          if (err) {
            return res.status(500).send({
              message: "Error generating tokens.",
            });
          }
          console.log("tokens");
          return res.cookie("accessToken", tokens.accessToken, { httpOnly: true }).cookie("refreshToken", tokens.refreshToken, { httpOnly: true }).status(200).send({
            message: "Logged in!",
          });
        });
      }
    }
  
    // LOGIC FOR REGULAR USERS WILL GO HERE, IF ONE DAY I DECIDE IT'S WORTH IT
  
    // If regular user logic is added in the future, place it here
  
    res.status(401).send({
      message: "Invalid credentials",
    });
  }

export function logout(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).send({
        message: "Logged out!",
  })
}

export function refreshLogin(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
      return res.status(401).send({
            message: "No refresh token provided.",
      })
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, (err, user) => {
      if (err) {
          console.log(err);
          return res.status(403).send({
                message: "Invalid refresh token.",
          });
      }
      
      generateTokens(user, (err, tokens) => {
          if (err) {
              console.log(err);
              return res.status(500).send("Error generating tokens.");
          }
          res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
          res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
          res.status(200).send({
                message: "Refreshed access token.",
          });
      });
  });
}

export function getCurrentUser(req, res) {
  const token = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
      if (err) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).send({
                        message: "Both access and refresh tokens are invalid.",
                });
            }
            
            generateTokens(user, (err, tokens) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error generating tokens.");
                }
                res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
                res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
                const filteredUser = {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                };
                res.status(200).json(filteredUser);
            });
        });
      }else{
          const filteredUser = {
              id: user.id,
              username: user.username,
              role: user.role,
          };
          res.status(200).json(filteredUser);
      }
  }
  );
}



export function generateTokens (user, callback)  {
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