import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../../api/authApi';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

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
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 transition-colors duration-300">
            {/* Background Effects */}
            <div className="pointer-events-none absolute top-10 -right-20 w-[300px] h-[300px] rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-3xl animate-pulse animation-delay-200" />
        
            <div className="w-full max-w-md relative z-10 animate-fade-up">
                <div className="bg-white dark:bg-[var(--color-dark-card)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-3xl shadow-xl p-8 backdrop-blur-xl overflow-hidden relative text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                    
                    {status === 'loading' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sora tracking-tight mb-2">Verificando...</h2>
                            <p className="text-slate-500 dark:text-zinc-400 font-medium">Estamos confirmando tu correo electrónico.</p>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner text-emerald-600 dark:text-[var(--color-primary)]">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sora tracking-tight mb-2">¡Todo listo!</h2>
                            <p className="text-emerald-700 dark:text-[var(--color-primary)] font-medium mb-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 p-4 rounded-xl flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                {message}
                            </p>
                            <Link to="/login" className="group relative w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.2)] hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}
                    
                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner text-red-600 dark:text-red-400">
                                <XCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sora tracking-tight mb-2">Error de Verificación</h2>
                            <p className="text-red-600 dark:text-red-400 font-medium mb-8 bg-red-50 dark:bg-red-500/10 border border-red-200/50 p-4 rounded-xl">
                                {message}
                            </p>
                            <Link to="/register" className="group relative w-full flex justify-center items-center gap-2 bg-slate-800 dark:bg-zinc-800 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-900 dark:hover:bg-zinc-700 transition-all duration-300 hover:-translate-y-0.5">
                                Volver al Registro
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;