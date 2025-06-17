import userModel from "../model/userModel.js";



export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);  // ✅ now this works
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};
