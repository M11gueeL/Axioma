import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { UserPlus, Loader2, User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';

const COUNTRY_CODES = [
    { label: 'Venezuela', value: '+58' },
    { label: 'Estados Unidos', value: '+1' },
    { label: 'Colombia', value: '+57' },
    { label: 'Mexico', value: '+52' },
    { label: 'Argentina', value: '+54' },
    { label: 'Chile', value: '+56' },
    { label: 'Peru', value: '+51' },
    { label: 'España', value: '+34' },
    { label: 'Brasil', value: '+55' },
    { label: 'Canada', value: '+1' },
];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        country_code: '+58',
        phone_number: '',
        birth_date: ''
    });
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales.');
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Las contraseñas no coinciden.');
            setIsSubmitting(false);
            return;
        }

        try {
            const cleanedPhone = formData.phone_number.replace(/\s+/g, '');
            const payload = {
                ...formData,
                phone_number: cleanedPhone ? `${formData.country_code}${cleanedPhone}` : '',
                birth_date: formData.birth_date || null,
            };

            await registerUser(payload);
            navigate('/login', { state: { message: 'Registro exitoso. Por favor revisa tu correo electrónico para acceder al enlace de verificación antes de iniciar sesión.' } });
        } catch (err) {
            const backendErrors = err.response?.data;
            setError(backendErrors ? Object.values(backendErrors).flat()[0] : 'Error en el registro');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-12 px-4 transition-colors duration-300">
            {/* Background Effects */}
            <div className="pointer-events-none absolute top-10 -right-14 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-5 -left-14 w-[300px] h-[300px] rounded-full bg-emerald-400/10 blur-3xl animate-pulse animation-delay-200" />

            <div className="w-full max-w-2xl relative z-10 animate-fade-up">
                <div className="bg-white dark:bg-[var(--color-dark-card)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-3xl shadow-xl p-8 sm:p-12 backdrop-blur-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                    
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <UserPlus className="w-8 h-8 text-emerald-600 dark:text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-sora tracking-tight">Crea tu cuenta</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Únete a la comunidad de Axioma hoy mismo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-xl border border-red-200/50 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                    value={formData.first_name}
                                    placeholder="Juan"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Apellido</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                    value={formData.last_name}
                                    placeholder="Pérez"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Nombre de Usuario</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                        value={formData.username}
                                        placeholder="juanp"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Correo Electrónico</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                        value={formData.email}
                                        placeholder="juan@ejemplo.com"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        maxLength={50}
                                        className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium tracking-widest"
                                        value={formData.password}
                                        placeholder="••••••••"
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
                                <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2 font-medium">La contraseña no debe ser obvia. Mínimo 8 caracteres e incluir letras, números y al menos un carácter especial.</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Confirmar Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                    </div>
                                    <input
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        required
                                        maxLength={50}
                                        className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium tracking-widest"
                                        value={formData.password_confirmation}
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    >
                                        {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Teléfono</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <select
                                        name="country_code"
                                        className="w-full sm:w-1/3 px-3 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                                        value={formData.country_code}
                                        onChange={handleChange}
                                    >
                                        {COUNTRY_CODES.map((code) => (
                                            <option key={code.label} value={code.value}>
                                                {code.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="relative group w-full sm:w-2/3">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 font-medium"
                                            placeholder="412 1234567"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[var(--color-dark-bg)] border border-slate-200 dark:border-[var(--color-dark-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-slate-900 dark:text-zinc-300 font-medium"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    style={{ colorScheme: 'dark' }} /* Simplifica el picker en modo oscuro aunque es una prop nativa del navegador */
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-black font-bold py-4 px-8 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.2)] hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 mt-8"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Procesando tu solicitud...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Crear mi cuenta
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 text-center text-slate-600 dark:text-zinc-400 font-medium">
                    ¿Ya tienes una cuenta en Axioma?{' '}
                    <Link to="/login" className="text-emerald-600 dark:text-[var(--color-primary)] font-bold hover:underline underline-offset-4">
                        Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;