import { useAuth } from "../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import "../styles/Login.css" // Reutilizamos estilos del login para consistencia

export default function Register() {
    const { register } = useAuth()
    const navigation = useNavigate()
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "vendedor" // Valor por defecto
    })
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
            await register(form)
            // Redirigir al login tras registro exitoso
            alert("Usuario registrado correctamente. Por favor inicia sesión.")
            navigation("/login")
        } catch (error) {
            console.error(error)
            setError(error.response?.data?.message || "Error al registrar usuario")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="title">Registro de Usuario</h2>

                {error && <p className="error-message">{error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        className="styled-input"
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        style={{ width: '50%' }}
                    />
                    <input
                        className="styled-input"
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        required
                        style={{ width: '50%' }}
                    />
                </div>

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

                <select
                    className="styled-input"
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    required
                >
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Administrador</option>
                </select>

                <button className={`submit-button ${loading ? 'disabled' : ''}`} type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar"}
                </button>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                </div>
            </form>
        </div>
    )
}
