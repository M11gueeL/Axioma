import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-cyan-50 to-amber-50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                    <h1 className="text-3xl font-black text-slate-900">Panel de Control</h1>
                    <button 
                        onClick={logout}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Usuario autenticado</p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900">
                            {fullName || user?.username || 'Usuario'}
                        </h2>
                        <p className="mt-2 text-slate-600">{user?.email || 'Sin correo registrado'}</p>
                    </div>

                    <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Contacto</p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">{user?.phone_number || 'No disponible'}</p>
                        <p className="mt-1 text-slate-600">Nacimiento: {user?.birth_date || 'No especificado'}</p>
                    </div>

                    {user?.role && (
                        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rol visible para administradores</p>
                            <p className="mt-3 text-xl font-bold text-cyan-700">{user.role}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;