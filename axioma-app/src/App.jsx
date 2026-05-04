import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Guards
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

// Layout & Global
import Header from './layouts/Header';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import RequestPasswordReset from './pages/auth/RequestPasswordReset';
import ConfirmPasswordReset from './pages/auth/ConfirmPasswordReset';
import ChangePassword from './pages/auth/ChangePassword';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            {/* Ruta pública siempre accesible */}
                            <Route path="/" element={<Home />} />

                            {/* Rutas exclusivas para usuarios NO autenticados (Login/Register) */}
                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
                                <Route path="/request-password-reset" element={<RequestPasswordReset />} />
                                <Route path="/reset-password/:uid/:token" element={<ConfirmPasswordReset />} />
                            </Route>

                            {/* Rutas exclusivas para usuarios autenticados */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/change-password" element={<ChangePassword />} />
                                {/* Aquí irían más rutas protegidas: perfil, configuraciones, etc. */}
                            </Route>

                            {/* Rutas exclusivas para ADMIN */}
                            <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
                                {/* <Route path="/admin/users" element={<UserManagement />} /> */}
                            </Route>

                            {/* Catch all para rutas no encontradas (404) */}
                            <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[var(--color-dark-card)] text-zinc-800 dark:text-zinc-200 text-2xl">404 - Página no encontrada</div>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;