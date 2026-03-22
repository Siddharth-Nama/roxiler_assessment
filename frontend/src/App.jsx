import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import './index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';

// Placeholder Components (will be implemented in future subtasks)
const AdminDashboard = () => <div className="animate-fade p-20">Admin Dashboard</div>;
const UserDashboard = () => <div className="animate-fade p-20">User Dashboard</div>;
const StoreOwnerDashboard = () => <div className="animate-fade p-20">Store Owner Dashboard</div>;

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route path="/admin/*" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/user/*" element={
                        <ProtectedRoute allowedRoles={['User']}>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/store/*" element={
                        <ProtectedRoute allowedRoles={['StoreOwner']}>
                            <StoreOwnerDashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
