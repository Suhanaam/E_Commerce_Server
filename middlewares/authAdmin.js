import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies); // Debugging step
        
        const { token } = req.cookies;

        if (!token) {
            console.log("No token found");
            return res.status(401).json({ message: "admin not authorized" });
        }

        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log("Decoded Token:", decodedToken);

        if (!decodedToken || decodedToken.role !== "admin") {
            console.log("Unauthorized access attempt:", decodedToken);
            return res.status(401).json({ message: "User not authorized" });
        }

        req.user = decodedToken; // Attach user to request

        next();
    } 
    catch (error) {
        console.error("Auth error:", error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
