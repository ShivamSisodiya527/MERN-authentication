import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("token is is", token);
    if (!token) {
        return res.json({
            success: false,
            message: "Unauthorised access (no token) "
        })
    }
    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.body = req.body || {};
            req.body.userId = tokenDecode.id
        } else {
            return res.json({
                success: false,
                message: "Not authorised.Login again"
            });
        }


        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


export default userAuth;