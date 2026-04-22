import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Guards
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta pública siempre accesible */}
                    <Route path="/" element={<Home />} />

                    {/* Rutas exclusivas para usuarios NO autenticados (Login/Register) */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Rutas exclusivas para usuarios autenticados */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Aquí irían más rutas protegidas: perfil, configuraciones, etc. */}
                    </Route>

                    {/* Rutas exclusivas para ADMIN */}
                    <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
                        {/* <Route path="/admin/users" element={<UserManagement />} /> */}
                    </Route>

                    {/* Catch all para rutas no encontradas (404) */}
                    <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-800 text-2xl">404 - Página no encontrada</div>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;