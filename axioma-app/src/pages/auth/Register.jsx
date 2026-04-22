import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authApi';

const COUNTRY_CODES = [
    { label: 'Venezuela (+58)', value: '+58' },
    { label: 'Estados Unidos (+1)', value: '+1' },
    { label: 'Colombia (+57)', value: '+57' },
    { label: 'Mexico (+52)', value: '+52' },
    { label: 'Argentina (+54)', value: '+54' },
    { label: 'Chile (+56)', value: '+56' },
    { label: 'Peru (+51)', value: '+51' },
    { label: 'Espana (+34)', value: '+34' },
    { label: 'Brasil (+55)', value: '+55' },
    { label: 'Canada (+1)', value: '+1' },
];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        country_code: '+58',
        phone_number: '',
        birth_date: ''
    });
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const cleanedPhone = formData.phone_number.replace(/\s+/g, '');
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: cleanedPhone ? `${formData.country_code}${cleanedPhone}` : '',
                birth_date: formData.birth_date || null,
            };

            await registerUser(payload);
            // Redirigimos al login para que el usuario inicie sesión formalmente.
            navigate('/login', { state: { message: 'Registro exitoso. Ahora inicia sesion.' } });
        } catch (err) {
            const backendErrors = err.response?.data;
            // Manejo de errores específicos de Django Rest Framework
            setError(backendErrors ? Object.values(backendErrors).flat()[0] : 'Error en el registro');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-cyan-50 via-slate-100 to-amber-50 py-10 px-4">
            <div className="pointer-events-none absolute top-10 -right-14 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

            <div className="max-w-xl w-full mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_22px_80px_-35px_rgba(15,118,110,0.7)] p-8 border border-white/80 animate-[fadeIn_500ms_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crea tu cuenta</h2>
                    <p className="text-slate-600 mt-2">Configura tu acceso seguro a Axioma</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                name="first_name"
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido</label>
                            <input
                                type="text"
                                name="last_name"
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                        <div className="grid grid-cols-1 sm:grid-cols-[42%_58%] gap-2">
                            <select
                                name="country_code"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                                value={formData.country_code}
                                onChange={handleChange}
                            >
                                {COUNTRY_CODES.map((code) => (
                                    <option key={`${code.label}-${code.value}`} value={code.value}>
                                        {code.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="phone_number"
                                placeholder="4121234567"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de nacimiento</label>
                        <input
                            type="date"
                            name="birth_date"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formData.birth_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 rounded-xl transition-all mt-4 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Procesando...' : 'Registrar Cuenta'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-cyan-700 font-semibold hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;