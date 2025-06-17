import React, { useContext } from 'react'
import image from '/src/assets/logo.png'
import { FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

    const verificationOtp = async () => {
        try {

            const { data } = await axios.post(backendUrl + '/user/send-verify-otp', {}, {
                withCredentials: true
            })
            console.log("d", data);
            if (data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            } else {

                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/user/logout'

            )
            if (data.success) {
                toast(data.message);
            }
            data.success && setIsLoggedIn(false)
            data.success && setUserData(false)
            navigate('/login')
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 top-0'>

            <img src={image} alt="helll" className='w-15 sm:w-15 ' />
            {
                userData ? <div className='w-8 h-8  flex justify-center items-center rounded-full bg-black text-white relative group '>{
                    userData.name[0].toUpperCase()
                }
                    <div className='absolute hidden group-hover:block top-0 right-0
                z-10 text-black rounded pt-10'>
                        <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                            {
                                !userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={verificationOtp}>Verify Email</li>
                            }

                            <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 ' onClick={logoutHandler}>Logout</li>
                        </ul>
                    </div>

                </div> : <button onClick={() => navigate("/login")} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-300 transition-all'>
                    Login <FaArrowRight />
                </button>

            }


        </div>

    )
}

export default Navbar
