import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../../api/authApi';

const VerifyEmail = () => {
    const { uid, token } = useParams();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyEmail(uid, token);
                setStatus('success');
                setMessage(response.data?.detail || '¡Correo electrónico verificado exitosamente!');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.detail || 'El enlace de verificación es inválido o ha expirado.');
            }
        };

        if (uid && token) {
            verify();
        }
    }, [uid, token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Verificación de Correo</h2>
                
                {status === 'loading' && (
                    <div className="py-4">
                        <p className="text-gray-600">Verificando tu correo, por favor espera...</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="py-4">
                        <p className="text-green-600 font-medium mb-6">{message}</p>
                        <Link 
                            to="/login" 
                            className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-200"
                        >
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="py-4">
                        <p className="text-red-500 font-medium mb-6">{message}</p>
                        <Link 
                            to="/register" 
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Volver al Registro
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;