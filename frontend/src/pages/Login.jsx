import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/Login.css"

export default function Login() {
    const { login } = useAuth()
    const navigation = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await login(form)
            navigation("/dashboard")
        } catch (error) {
            setError(error.response?.data?.message || "Credenciales Invalidas")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="title">Inicio sesión</h2>

                {error && <p className="error-message">{error}</p>}

                <input
                    className="styled-input"
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    className="styled-input"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button className={`submit-button ${loading ? 'disabled' : ''}`} type="submit" disabled={loading}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </div>
    )
}