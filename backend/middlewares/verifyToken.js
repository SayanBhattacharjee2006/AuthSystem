import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            console.log("Invalid token - error in decoded token");
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized - Invalid token" });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error in verifyToken: ", error);
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - Invalid token" });
    }
};
