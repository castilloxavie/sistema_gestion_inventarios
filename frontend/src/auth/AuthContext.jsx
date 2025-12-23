import api from "../api/axios.js";
import {createContext, useContext, useState} from "react"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    )

    const login = async (credential) => {
        const response = await api.post("/auth/login", credential)
        // El backend devuelve { data: { token, user } }
        const {token, user} = response.data.data

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
    }

    const register = async (userData) => {
        // userData: { nombre, apellido, email, password, rol }
        const response = await api.post("/auth/register", userData)
        return response.data
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
