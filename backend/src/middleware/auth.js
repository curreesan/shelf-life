import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const authBearerToken = req.headers.authorization;

    if (!authBearerToken || !authBearerToken.startsWith("Bearer ")) {
      res.status(401).json({ message: `auth token unavailable` });
      return;
    }

    const token = authBearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(`Authorization Error : ${err}`);
    res.status(401).json({ message: `Authorization Error : ${err}` });
  }
};
