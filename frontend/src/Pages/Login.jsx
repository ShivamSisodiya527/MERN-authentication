import React, { useContext, useState } from 'react'
import personIcon from "/src/assets/person_icon.svg"
import mailIcon from "/src/assets/mail_icon.svg"
import lockIcon from "/src/assets/lock_icon.svg"
import { useNavigate } from "react-router-dom";
import { AppContext, AppContextProvider } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
const Login = () => {
    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);
    const navigate = useNavigate();
    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (state === 'Sign Up') {
                const { data } = await axios.post(
                    backendUrl + "/user/register",
                    { name, email, password },
                    { withCredentials: true }
                );
                if (data.success) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/user/login',
                    {
                        email,
                        password
                    },
                    { withCredentials: true }
                );
                if (data.success) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/');
                } else {
                    toast.error(data.message);  // ✅ Corrected line
                }
            }
        } catch (error) {
            console.log("error is", error);
            toast.error(error.message);  // ✅ You can also show this on unexpected errors
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen
        px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src='src/assets/logo.svg' className='absolute left-5 sm:left-20 
            top-5 w-28 sm:w-25 cursor-pointer'/>
            <div className='bg-slate-800 p-10 rounded-lg shadow-lg w-full
            sm:w-92 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3 '>{state === "Sign Up" ? "Create  Account" : 'Login '}</h2>
                <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create your Account" : 'Login to your account'}</p>
                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
                         rounded-full bg-[#5A628C]'>
                            <img src={personIcon} alt="hghjhk" />
                            <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required />

                        </div>

                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
                    rounded-full bg-[#5A628C]'>
                        <img src={mailIcon} alt="hghjhk" />
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Enter email' required />

                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
                    rounded-full bg-[#5A628C]'>
                        <img src={lockIcon} alt="hghjhk" />
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Enter password' required />

                    </div>
                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password   </p>
                    <button className='w-full py-2.5  rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
                </form>
                {state === 'Sign Up' ? (<p className='text-gray-400 text-center text-sm mt-4'>Already  have an account?{" "}
                    <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
                </p>) : (<p className='text-gray-400 text-center text-sm mt-4'>Don't have an account?{" "}
                    <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
                    `</p>)}


            </div>
        </div>
    )
}

export default Login

