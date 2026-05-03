import React, { useState } from 'react';
import { changePassword } from '../../api/authApi';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        
        try {
            const response = await changePassword(oldPassword, newPassword);
            setMessage(response.data?.detail === "Password updated successfully." ? "Contraseña actualizada exitosamente." : (response.data?.detail || 'Operación exitosa.'));
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            // El backend del DRF suele mandar los errores dentro de arrays o non_field_errors
            let errDetail = err.response?.data?.detail 
                           || err.response?.data?.non_field_errors?.[0]
                           || err.response?.data?.old_password?.[0]
                           || 'Ocurrió un error al actualizar tu contraseña.';
            
            if (errDetail === "Old password is not correct.") errDetail = "La contraseña actual es incorrecta.";
            setError(errDetail);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cambiar Contraseña</h2>
            
            {message && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm font-medium">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm font-medium">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="oldPassword">
                        Contraseña Actual
                    </label>
                    <input
                        id="oldPassword"
                        type="password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Escribe tu contraseña actual"
                    />
                </div>
                
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
                        placeholder="Escribe tu nueva contraseña"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-2 py-2 px-4 shadow-sm text-white font-bold rounded-md transition duration-200 ${
                        isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;