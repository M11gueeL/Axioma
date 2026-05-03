import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../api/authApi';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        
        try {
            const response = await requestPasswordReset(email);
            // El backend devuelve una respuesta en inglés, podríamos sobreescribirla o mostrar un mensaje genérico.
            setMessage(response.data?.detail === "If an account exists with that email, we've sent you a password reset link." 
                ? 'Si existe una cuenta con ese correo electrónico, te hemos enviado un enlace para restablecer tu contraseña.' 
                : (response.data?.detail || 'Solicitud enviada correctamente.'));
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ocurrió un error. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Recuperar Contraseña</h2>
                
                {message && <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce tu correo"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 shadow-sm text-white font-bold rounded-md transition duration-200 ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RequestPasswordReset;