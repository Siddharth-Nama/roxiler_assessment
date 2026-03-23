import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import './index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import AdminStores from './pages/AdminStores';
import UserDetail from './pages/UserDetail';
import UserStores from './pages/UserStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import UpdatePassword from './pages/UpdatePassword';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const AppRoutes = () => {
    const location = useLocation();
    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin/stores" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminStores />
                </ProtectedRoute>
            } />
            <Route path="/admin/users/:id" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                    <UserDetail />
                </ProtectedRoute>
            } />
            
            <Route path="/user" element={
                <ProtectedRoute allowedRoles={['User']}>
                    <UserStores />
                </ProtectedRoute>
            } />
            
            <Route path="/store" element={
                <ProtectedRoute allowedRoles={['StoreOwner']}>
                    <StoreOwnerDashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/update-password" element={
                <ProtectedRoute>
                    <UpdatePassword />
                </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col bg-black text-white selection:bg-red-500/30">
                    <Navbar />
                    <main className="flex-1 w-full max-w-[1200px] mx-auto px-8 sm:px-12 lg:px-20 pt-32 pb-20">
                        <AppRoutes />
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
