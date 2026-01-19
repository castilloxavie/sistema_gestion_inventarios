import { useEffect, useState } from "react";
import { createProvider, updateProvider, getProviderById } from "../../services/providersServices";
import {useNavigate, useParams} from "react-router-dom";
import "../../styles/providers.css"
import { Home } from 'lucide-react';

export default function ProviderForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        email: "",
        direccion: ""
    });

    useEffect(() => {
        if (id) {
            getProviderById(id).then(setForm);
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id) {
            await updateProvider(id, form);
        } else {
            await createProvider(form);
        }

        navigate("/providers");
    };

    return (
        <div className="provider-form">
            <div className="form-header">
                <h2>{id ? "Editar proveedor" : "Nuevo proveedor"}</h2>
                <button className="btn btn-dashboard" onClick={() => navigate("/providers")}>
                    Volver a Proveedores
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Proveedor</label>
                    <input
                        id="nombre"
                        name="nombre"
                        placeholder="Ingrese el nombre del proveedor"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        id="telefono"
                        name="telefono"
                        placeholder="Ingrese el teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        placeholder="Ingrese el email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input
                        id="direccion"
                        name="direccion"
                        placeholder="Ingrese la dirección"
                        value={form.direccion}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn-submit">
                    {id ? "Actualizar Proveedor" : "Crear Proveedor"}
                </button>
            </form>
        </div>
    );
}