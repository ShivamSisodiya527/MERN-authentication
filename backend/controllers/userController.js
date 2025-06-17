import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../model/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "Please provide all the details"
        })
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already registered",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        })
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // ✅ true in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ works both places
            maxAge: 24 * 60 * 60 * 1000,
        });


        console.log("token sent register");
        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to CSN',
            text: `Welcome to CSN.Your account has been created successfully with email id ${email}`
        }
        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "User registered successfully",
            userId: user._id
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "email and password are required" })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist please register"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Email or password does not match"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // ✅ true in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ works both places
            maxAge: 24 * 60 * 60 * 1000,
        });


        console.log("token sent from login");
        return res.json({
            success: true,
            message: "User login successfully"
        })


    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({
            success: true,
            message: 'Logged out successfully',
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// send verification otp to user's email;
export const sendVerifyOtp = async (req, res) => {
    try {

        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account already verified"
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();
        // send opt to user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            // text: `Your OTP is ${otp}.Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            message: 'Verification OTP sent successfully on your registered E-mail'
        })

    } catch (error) {
        res.json({
            success: false,

            message: error.message
        });

    }
}


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Missing details"
        });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "Please enter valid OTP"
            });
        }

        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP Expired"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();

        return res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// send password reset otp

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            message: "Email is required"
        })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        const otp = String(Math.floor(10000 + Math.random() * 900000))
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset OTP",
            // text: `Your OTP for password reset is ${otp}`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: 'Otp sent to your email'
        })
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: error.message
        })
    }
}

// reset user password

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "Email,OTP and new password are required"
        })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.json({
                success: false,
                message: "Old and new Password can not be same"
            })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            })
        }
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();
        return res.json({
            success: true,
            message: "Password has been reset successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}



// export const resetPassword = async (req, res) => {
//     const { email, otp, newPassword } = req.body;
//     if (!email || !otp || !newPassword) {
//         return res.json({
//             success: false,
//             message: "Email, OTP and new password are required"
//         });
//     }

//     try {
//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // 🧪 Debug logs
//         console.log("Expected OTP:", user.resetOtp);
//         console.log("Received OTP:", otp);
//         console.log("OTP Expiry:", new Date(user.resetOtpExpiredAt));
//         console.log("Current Time:", new Date());

//         // ✅ Compare with toString + trim
//         if (!user.resetOtp || user.resetOtp.trim() !== otp.toString().trim()) {
//             return res.json({
//                 success: false,
//                 message: "Please enter valid otp"
//             });
//         }

//         if (Number(user.resetOtpExpiredAt) < Date.now()) {
//             return res.json({
//                 success: false,
//                 message: "OTP expired"
//             });
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         user.resetOtp = '';
//         user.resetOtpExpiredAt = 0;

//         await user.save();

//         return res.json({
//             success: true,
//             message: "Password has been reset successfully"
//         });
//     } catch (error) {
//         return res.json({
//             success: false,
//             message: error.message
//         });
//     }
// };
