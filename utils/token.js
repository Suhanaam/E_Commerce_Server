import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
    try {
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY); // Debugging

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is missing");
        }

        console.log("before token");
        const token = jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        console.log("after token");

        return token;
    } catch (error) {
        console.error("Token Generation Error:", error.message);
    }
};
