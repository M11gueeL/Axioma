import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200">
                    <h1 className="text-3xl font-bold text-stone-800">Panel de Control</h1>
                    <button 
                        onClick={logout}
                        className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <h2 className="text-xl font-semibold text-stone-700 mb-2">
                        Bienvenido, {user?.first_name || user?.username || 'Usuario'}
                    </h2>
                    <p className="text-stone-500">
                        Tu rol actual en el sistema es: <span className="font-bold text-stone-700">{user?.role || 'USER'}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;