import jwt from "jsonwebtoken";

export const authSeller = (req, res, next) => {
  try {
    // Try getting token from cookies or headers
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Seller not authorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Allow access if role is seller or admin
    if (decodedToken.role !== "seller" && decodedToken.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
