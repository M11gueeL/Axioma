import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, KeySquare, Loader2, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const result = await login(formData);
        
        if (result.success) {
            navigate('/dashboard'); 
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-12 px-4 transition-colors duration-300">
            {/* Background Effects */}
            <div className="pointer-events-none absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-1/4 -left-20 w-[300px] h-[300px] rounded-full bg-emerald-400/10 blur-3xl animate-pulse animation-delay-200" />

            <div className="w-full max-w-md relative z-10 animate-fade-up">
                <div className="bg-white dark:bg-[var(--color-dark-card)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-3xl shadow-xl p-8 backdrop-blur-xl overflow-hidden relative">
                    {/* Tiny decorative header shape */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <User className="w-8 h-8 text-emerald-600 dark:text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-sora tracking-tight">Bienvenido a Axioma</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {successMessage && (
                            <div className="rounded-xl border border-emerald-200/50 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-[var(--color-primary)] text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl border border-red-200/50 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Usuario</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                    placeholder="tunombre"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Contraseña</label>
                                <Link to="/request-password-reset" className="text-sm font-bold text-emerald-600 dark:text-[var(--color-primary)] hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                                    ¿La olvidaste?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeySquare className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium tracking-widest"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.2)] hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Autenticando
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Entrar a mi espacio
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 text-center text-slate-600 dark:text-zinc-400 font-medium">
                    ¿Aún no eres parte?{' '}
                    <Link to="/register" className="text-emerald-600 dark:text-[var(--color-primary)] font-bold hover:underline underline-offset-4">
                        Únete a Axioma
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;