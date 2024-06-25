import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken ] = useState(localStorage.getItem("token")); 

    const storeTokenInLS = (serverToken) => {
        localStorage.setItem('token', serverToken);
        setToken(serverToken);
    };

    let isLoggedIn = !!token;

    const LogoutUser = () => {
        setToken("");
        return localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
