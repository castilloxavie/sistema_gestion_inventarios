import {Navigate} from "react-router-dom"
import {useAuth} from "./AuthContext"

export default function ProtectedRouter({children, role}) {
    const {user} = useAuth()

    if(!user) return <Navigate to="/login" />
    if(role && !role.includes(user.rol)){
        return <Navigate to="/dashboard" />
    }

    return children
}
