import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token provided",
      });
    }

    req.userId = decoded.userId; // The userId is the name passed to the user._id while creating the jwt
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
