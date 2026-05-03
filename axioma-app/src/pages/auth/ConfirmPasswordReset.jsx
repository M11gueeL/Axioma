import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { confirmPasswordReset } from '../../api/authApi';

const ConfirmPasswordReset = () => {
    const { uid, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');
        
        try {
            const response = await confirmPasswordReset(uid, token, newPassword);
            setMessage(response.data?.detail === "Password has been reset successfully. You may now login." ? "La contraseña se restableció correctamente. Ya puedes iniciar sesión." : (response.data?.detail || 'Operación exitosa.'));
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.detail === "Invalid or corrupted UID." || err.response?.data?.detail === "The reset token is invalid or has expired." 
                ? 'El enlace es inválido o ha expirado.' 
                : 'Ocurrió un error inesperado al restablecer la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Establecer Nueva Contraseña</h2>
                
                {message ? (
                    <div className="text-center py-4">
                        <p className="text-green-600 font-medium mb-6 bg-green-50 p-4 rounded-md">{message}</p>
                        <Link 
                            to="/login" 
                            className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-200"
                        >
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="newPassword">
                                Nueva Contraseña
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Escribe la nueva contraseña"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite la nueva contraseña"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2 px-4 shadow-sm text-white font-bold rounded-md transition duration-200 ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConfirmPasswordReset;