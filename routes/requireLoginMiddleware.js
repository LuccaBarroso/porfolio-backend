export const requireLogin = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).send({ message: "You are not allowed to do that." });
  }
};
