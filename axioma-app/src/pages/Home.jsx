import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-amber-50 via-sky-50 to-cyan-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl animate-pulse" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl p-8 md:p-14 shadow-[0_20px_90px_-30px_rgba(2,132,199,0.45)]">
                    <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                        Plataforma Operativa
                    </span>

                    <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight text-slate-900">
                        Gestiona tu equipo con
                        <span className="block text-cyan-700">claridad y control en Axioma</span>
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
                        Centraliza usuarios, sesiones y auditoria en una sola experiencia. Disenada para operar rapido,
                        reducir errores y mantener una trazabilidad profesional en cada accion.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    {isAuthenticated ? (
                        <Link 
                            to="/dashboard" 
                            className="px-8 py-4 bg-cyan-700 text-white hover:bg-cyan-800 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:-translate-y-0.5"
                        >
                            Ir al Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="px-8 py-4 bg-cyan-700 text-white hover:bg-cyan-800 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:-translate-y-0.5"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                to="/register" 
                                className="px-8 py-4 bg-white text-cyan-800 border border-cyan-200 hover:bg-cyan-50 rounded-xl font-semibold transition-all duration-300 text-lg"
                            >
                                Crear Cuenta
                            </Link>
                        </>
                    )}
                </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white/90 p-5 border border-slate-100 shadow-sm">
                            <h3 className="text-slate-900 font-bold">Control de Acceso</h3>
                            <p className="text-slate-600 mt-2 text-sm">JWT con flujo seguro y recuperacion automatica de sesion.</p>
                        </div>
                        <div className="rounded-2xl bg-white/90 p-5 border border-slate-100 shadow-sm">
                            <h3 className="text-slate-900 font-bold">Perfil Unificado</h3>
                            <p className="text-slate-600 mt-2 text-sm">Datos del usuario autenticado servidos desde backend en tiempo real.</p>
                        </div>
                        <div className="rounded-2xl bg-white/90 p-5 border border-slate-100 shadow-sm">
                            <h3 className="text-slate-900 font-bold">Auditoria</h3>
                            <p className="text-slate-600 mt-2 text-sm">Historial de sesiones para trazabilidad y cumplimiento operativo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;