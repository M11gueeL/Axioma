import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../api/authApi';
import { KeySquare, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-12 px-4 transition-colors duration-300">
            {/* Background Effects */}
            <div className="pointer-events-none absolute top-10 -right-20 w-[300px] h-[300px] rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-3xl animate-pulse animation-delay-200" />

            <div className="w-full max-w-md relative z-10 animate-fade-up">
                <div className="bg-white dark:bg-[var(--color-dark-card)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-3xl shadow-xl p-8 backdrop-blur-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <KeySquare className="w-8 h-8 text-emerald-600 dark:text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-sora tracking-tight">Recuperar Clave</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Ingresa tu correo para recibir un enlace de recuperación.</p>
                    </div>
                
                    {message && (
                        <div className="rounded-xl border border-emerald-200/50 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 mb-6 text-emerald-700 dark:text-[var(--color-primary)] text-sm flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}
                    
                    {error && (
                        <div className="rounded-xl border border-red-200/50 bg-red-50 dark:bg-red-500/10 px-4 py-3 mb-6 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Correo Electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                    value={email}
                                    placeholder="juan@ejemplo.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.2)] hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Enviando enlace...
                                </>
                            ) : (
                                <>
                                    <KeySquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Recuperar Contraseña
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-emerald-600 dark:text-[var(--color-primary)] font-bold hover:underline underline-offset-4">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestPasswordReset;