import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("token is", token);

    if (!token) {
        return res.json({
            success: false,
            message: "Unauthorized access (no token)",
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id; // ✅ yeh karo
        } else {
            return res.json({
                success: false,
                message: "Not authorized. Login again",
            });
        }

        next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export default userAuth;
