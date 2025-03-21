import jwt from "jsonwebtoken";

export const authSeller = (req, res, next) => {
    try {
        // Collect token from cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Decode token
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log(decodedToken, "======decodedToken");

        if (!decodedToken) {
            return res.status(401).json({ message: "User not authorized" });
        }
      
        if(decodedToken.role!="seller" && decodedToken.role!="admin")
        {
            return res.status(401).json({message:"user not authorized"});
        }
        // Attach user data to req object
        req.user = decodedToken; // ✅ Now req.user is available

        // Proceed to next middleware
        next();
    } 
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
