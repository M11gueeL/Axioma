import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;

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
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-100 via-cyan-50 to-amber-50 px-4 py-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-200/40 blur-3xl rounded-full" />

            <div className="max-w-md w-full mx-auto relative z-10 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_18px_70px_-35px_rgba(14,116,144,0.7)] p-8 border border-white/80 animate-[fadeIn_500ms_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido a Axioma</h2>
                    <p className="text-slate-600 mt-2">Ingresa con tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {successMessage && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="Tu usuario"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full mt-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
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
                    <Link to="/register" className="text-cyan-700 font-semibold hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;