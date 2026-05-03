import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navLinks = isAuthenticated 
        ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Cambiar Clave', path: '/change-password' }
          ]
        : [];

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-[0_0_15px_rgba(84,247,143,0.5)] group-hover:scale-105 transition-transform duration-300">
                                <Sparkles className="w-6 h-6 text-black" />
                            </div>
                            <span className="font-sora font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                                AXIOMA
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                className={`text-sm font-semibold transition-colors duration-200 hover:text-[var(--color-primary)] ${location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-slate-600 dark:text-zinc-300'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right utilities: Theme Toggle & Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-600 dark:text-zinc-300"
                            aria-label="Alternar tema"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="h-6 w-px bg-slate-300 dark:bg-zinc-700"></div>

                        {isAuthenticated ? (
                            <button 
                                onClick={logout}
                                className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className="text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Ingresar
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-[var(--color-primary)] text-black text-sm font-bold px-5 py-2.5 rounded-full hover:brightness-110 shadow-[0_0_20px_rgba(84,247,143,0.3)] hover:shadow-[0_0_30px_rgba(84,247,143,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Únete ahora
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-600 dark:text-zinc-300"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={toggleMobileMenu}
                            className="text-slate-600 dark:text-zinc-300"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-[var(--color-dark-bg)] border-b border-gray-200 dark:border-zinc-800 shadow-xl animate-fade-up">
                    <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold text-slate-600 dark:text-zinc-300 hover:text-[var(--color-primary)] p-2"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {isAuthenticated ? (
                            <button 
                                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                className="text-left w-full text-base font-semibold text-red-500 p-2"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-center w-full text-base font-semibold text-slate-700 dark:text-zinc-200 p-2"
                                >
                                    Ingresar
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-center w-full bg-[var(--color-primary)] text-black font-bold px-5 py-3 rounded-xl"
                                >
                                    Únete ahora
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
