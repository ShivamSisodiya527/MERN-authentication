import { createContext, useEffect, useState } from "react";
import React from "react";
import { data } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContent = createContext()


export const AppContextProvider = (props) => {
    const backendUrl = "https://mern-authentication-adj1.onrender.com"
    console.log("backend url", backendUrl);
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/user/is-auth')
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        getAuthState();
    }, [])
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/auth/data', {
                withCredentials: true
            })
            console.log("daata", data);
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }


    }
    const value = {
        backendUrl,
        isLoggedin, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}