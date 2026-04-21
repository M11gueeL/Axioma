import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); // Limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const result = await login(formData);
        
        if (result.success) {
            navigate('/dashboard'); // O la ruta principal de Axioma
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Bienvenido a Axioma</h2>
                    <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm animate-pulse">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Tu usuario"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-semibold text-slate-700">Contraseña</label>
                            <Link to="/auth/forgot-password" size="sm" className="text-xs text-blue-600 hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Autenticando...
                            </>
                        ) : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/auth/register" className="text-blue-600 font-semibold hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;