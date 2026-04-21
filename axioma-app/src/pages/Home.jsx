import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center space-y-8">
                <h1 className="text-5xl md:text-7xl font-extrabold text-stone-800 tracking-tight">
                    Gestión Inteligente con <span className="text-stone-600">Axioma</span>
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-stone-500 max-w-2xl mx-auto font-light">
                    Una plataforma robusta y minimalista diseñada para optimizar tus procesos operativos sin distracciones.
                </p>
                
                <div className="mt-10 flex justify-center gap-4">
                    {isAuthenticated ? (
                        <Link 
                            to="/dashboard" 
                            className="px-8 py-4 bg-stone-800 text-stone-50 hover:bg-stone-900 rounded-md font-medium transition-colors text-lg"
                        >
                            Ir al Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link 
                                to="/auth/login" 
                                className="px-8 py-4 bg-stone-800 text-stone-50 hover:bg-stone-900 rounded-md font-medium transition-colors text-lg"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                to="/auth/register" 
                                className="px-8 py-4 bg-stone-200 text-stone-800 hover:bg-stone-300 rounded-md font-medium transition-colors text-lg"
                            >
                                Crear Cuenta
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;