import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { confirmPasswordReset } from '../../api/authApi';
import { KeyRound, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const ConfirmPasswordReset = () => {
    const { uid, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('La nueva contraseña debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales.');
            return;
        }
        
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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-12 px-4 transition-colors duration-300">
            {/* Background Effects */}
            <div className="pointer-events-none absolute top-10 -right-20 w-[300px] h-[300px] rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-3xl animate-pulse animation-delay-200" />
            
            <div className="w-full max-w-md relative z-10 animate-fade-up">
                <div className="bg-white dark:bg-[var(--color-dark-card)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-3xl shadow-xl p-8 backdrop-blur-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-sora tracking-tight">Nueva Clave</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Establece tu nueva contraseña segura.</p>
                    </div>
                
                {message ? (
                    <div className="text-center py-4">
                        <p className="text-emerald-700 dark:text-[var(--color-primary)] font-medium mb-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 p-4 rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            {message}
                        </p>
                        <Link 
                            to="/login" 
                            className="group relative w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.2)] hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-xl border border-red-200/50 bg-red-50 dark:bg-red-500/10 px-4 py-3 mb-6 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Nueva Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                </div>
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    required
                                    maxLength={50}
                                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium tracking-widest"
                                    value={newPassword}
                                    placeholder="••••••••"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2 font-medium">La contraseña no debe ser obvia. Mínimo 8 caracteres e incluir letras, números y al menos un carácter especial.</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Confirmar Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    maxLength={50}
                                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium tracking-widest"
                                    value={confirmPassword}
                                    placeholder="••••••••"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
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
                                    Restableciendo...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Actualizar Clave
                                </>
                            )}
                        </button>
                    </form>
                )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmPasswordReset;