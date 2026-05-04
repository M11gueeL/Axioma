import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessagesSquare, Sparkles, Send, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="relative min-h-screen overflow-hidden transition-colors duration-300">
            {/* Decorative Orbs */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/5 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-0 -left-64 w-[600px] h-[600px] rounded-full bg-emerald-300/10 dark:bg-emerald-900/10 blur-3xl animate-pulse animation-delay-300" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-[var(--color-primary)]/10 text-emerald-800 dark:text-[#6AFA9F] text-sm font-bold uppercase tracking-widest mb-8 border border-emerald-200 dark:border-[var(--color-primary)]/20 shadow-md dark:shadow-[0_0_20px_rgba(84,247,143,0.15)] transition-colors">
                        <Sparkles className="w-4 h-4" />
                        <span>Bienvenido a tu nuevo espacio</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-8 font-sora">
                        Descubre un mundo hecho para ti en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-[var(--color-primary)] dark:to-emerald-400">Axioma</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-zinc-400 leading-relaxed mb-12">
                        Imagina un rincón acogedor donde tus pensamientos, tus ideas, tu arte y tu voz importan. Un mini-blog donde puedes ser tú mismo y compartir eso que te hace único de una manera súper sencilla.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        {isAuthenticated ? (
                            <Link 
                                to="/dashboard" 
                                className="group flex items-center gap-3 bg-[var(--color-primary)] text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
                            >
                                Mi Espacio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link 
                                    to="/register" 
                                    className="group flex items-center justify-center gap-3 bg-[var(--color-primary)] text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(84,247,143,0.4)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                                >
                                    ¡Quiero unirme! <Heart className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="flex items-center justify-center bg-white dark:bg-zinc-800/50 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto"
                                >
                                    Ya soy parte
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    {/* Feature 1 */}
                    <div className="bg-white/60 dark:bg-[var(--color-dark-card)]/40 backdrop-blur-xl border border-slate-100 dark:border-[var(--color-dark-border)]/80 p-8 rounded-3xl hover:-translate-y-2 hover:shadow-[0_15px_30px_-15px_rgba(84,247,143,0.2)] transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Send className="w-7 h-7 text-emerald-600 dark:text-[var(--color-primary)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Expresa lo que sientes</h3>
                        <p className="text-slate-600 dark:text-zinc-400">
                            Escribe y publica posteos con total libertad. Sube una foto linda, cuenta tu día, y deja que los demás te lean en un ambiente amable.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white/60 dark:bg-[var(--color-dark-card)]/40 backdrop-blur-xl border border-slate-100 dark:border-[var(--color-dark-border)]/80 p-8 rounded-3xl hover:-translate-y-2 hover:shadow-[0_15px_30px_-15px_rgba(84,247,143,0.2)] transition-all duration-300 group animation-delay-100">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessagesSquare className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Conecta Enseguida</h3>
                        <p className="text-slate-600 dark:text-zinc-400">
                            No solo se trata de leer, ¡sino de conversar! Responde a las historias de los demás o envíales mensajes cuando te sientas inspirado.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white/60 dark:bg-[var(--color-dark-card)]/40 backdrop-blur-xl border border-slate-100 dark:border-[var(--color-dark-border)]/80 p-8 rounded-3xl hover:-translate-y-2 hover:shadow-[0_15px_30px_-15px_rgba(84,247,143,0.2)] transition-all duration-300 group animation-delay-200">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Comunidad Positiva</h3>
                        <p className="text-slate-600 dark:text-zinc-400">
                            Cuidamos de tu experiencia para que Axioma siempre sea ese refugio de internet al que te da gusto volver todos los días.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;