import React, { useContext, useEffect, useState } from 'react'
import logo from "/src/assets/logo.svg";
import mailIcon from "/src/assets/mail_icon.svg"
import lockIcon from "/src/assets/lock_icon.svg"
import { useNavigate } from 'react-router-dom';
import { AppContextProvider } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const ResetPassword = () => {
    const { backendUrl } = useContext(AppContextProvider)

    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const inputRefs = React.useRef([]);
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState('')
    const [otp, setOtp] = useState(0)
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(0)
    const handleInput = (e, index) => {
        // If user types something, move to next input
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle Backspace key
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        // If the user types a value, move to the next input
        else if (e.key !== 'Backspace' && e.target.value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })

    }

    const onSubmitOTP = async (e) => {

        e.preventDefault();
        const otpArray = inputRefs.current.map(input => input.value)
        setOtp(otpArray.join(''))
        setIsOtpSubmitted(true)

    }

    // useEffect(() => {
    //     isLoggedin && userData && userData.isAccountVerified && navigate('/')
    // }, [isLoggedin, userData])

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                backendUrl + '/user/send-reset-otp',
                { email },
                { withCredentials: true }
            );

            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/user/reset-password', { email, otp, newPassword }, { withCredentials: true })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')

        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
            <img
                src={logo}
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
                onClick={() => navigate('/')}
            />
            {/* enter email ID */}
            {
                !isEmailSent &&
                <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C'>
                        <img src={mailIcon} className='w-3 h-3' />
                        <input
                            name={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            type="email"
                            placeholder="Enter email"
                            className=" rounded-full w-full px-4 py-2  bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />


                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
                </form>
            }

            {/* otp input form */}
            {
                !isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email ID</p>
                    <div className='flex justify-between mb-8' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                type="text"
                                maxLength={1}
                                key={index}
                                required
                                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                                ref={el => inputRefs.current[index] = el}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)} // Handle both backspace and text input
                            />
                        ))}
                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
                        Submit
                    </button>
                </form>

            }

            {/* enter new password */}
            {
                isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter the new Password below</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C'>
                        <img src={lockIcon} className='w-3 h-3' />
                        <input
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            type="password"
                            placeholder="Enter Password"
                            className=" rounded-full w-full px-4 py-2  bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />


                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
                </form>


            }

        </div>
    )
}

export default ResetPassword
