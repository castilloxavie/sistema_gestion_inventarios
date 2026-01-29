import React, { useEffect, useState } from 'react';
import { Search, Phone, Mail, User } from 'lucide-react';
import api from '../../api/axios';

export default function ClientManagement() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client => {
        if (!searchTerm) return true;
        const fullName = `${client.nombre} ${client.apellido}`.toLowerCase();
        const doc = client.documento.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) || doc.includes(searchLower);
    });

    if (loading) {
        return (
            <div className="client-management">
                <div className="client-header">
                    <h3 className="client-title">Gestión de Clientes</h3>
                </div>
                <div className="loading">Cargando clientes...</div>
            </div>
        );
    }

    return (
        <div className="client-management">
            <div className="client-header">
                <h3 className="client-title">Gestión de Clientes</h3>
                <div className="search-container">
                    <Search size={16} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="clients-grid">
                {filteredClients.length > 0 ? (
                    filteredClients.slice(0, 6).map(client => (
                        <div key={client.id} className="client-card">
                            <div className="client-avatar">
                                {client.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="client-info">
                                <div className="client-name">
                                    {client.nombre} {client.apellido}
                                </div>
                                <div className="client-doc">
                                    {client.documento}
                                </div>
                                <div className="client-contact">
                                    {client.telefono && (
                                        <div className="contact-item">
                                            <Phone size={12} />
                                            {client.telefono}
                                        </div>
                                    )}
                                    {client.email && (
                                        <div className="contact-item">
                                            <Mail size={12} />
                                            {client.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        {searchTerm ? 'No se encontraron clientes que coincidan con la búsqueda.' : 'No hay clientes registrados.'}
                    </div>
                )}
            </div>
        </div>
    );
}
