import React, { useState } from 'react';
import { changePassword } from '../../api/authApi';
import { Lock, ShieldAlert, Save, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('La nueva contraseña debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales.');
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await changePassword(oldPassword, newPassword);
            setMessage(response.data?.detail === "Password updated successfully." ? "Contraseña actualizada exitosamente." : (response.data?.detail || 'Operación exitosa.'));
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
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
        <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-up">
            <div className="bg-white dark:bg-[var(--color-dark-card)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-3xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                
                <div className="p-8 sm:p-12">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <ShieldAlert className="w-8 h-8 text-emerald-600 dark:text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-sora tracking-tight">Cambiar Clave</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Actualiza tu contraseña periódicamente para mayor seguridad.</p>
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
                    
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Contraseña Actual</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                </div>
                                <input
                                    id="oldPassword"
                                    type={showOldPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium tracking-widest"
                                    value={oldPassword}
                                    placeholder="••••••••"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                >
                                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Nueva Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldAlert className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
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
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.2)] hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 mt-8"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Actualizar Contraseña
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;