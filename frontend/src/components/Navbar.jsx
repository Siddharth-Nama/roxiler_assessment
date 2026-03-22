import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Store, Users, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="glass m-4 p-4 flex items-center justify-between sticky top-4 z-50">
            <div className="flex items-center gap-2">
                <Store className="text-primary" size={28} />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Roxiler Store
                </span>
            </div>

            <div className="flex items-center gap-6">
                {user.role === 'Admin' && (
                    <>
                        <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link to="/admin/stores" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Store size={18} /> Stores
                        </Link>
                        <Link to="/admin/users" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Users size={18} /> Users
                        </Link>
                    </>
                )}

                {user.role === 'User' && (
                    <>
                        <Link to="/user" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Store size={18} /> Browse Stores
                        </Link>
                    </>
                )}

                {user.role === 'StoreOwner' && (
                    <>
                        <Link to="/store" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <LayoutDashboard size={18} /> My Store
                        </Link>
                    </>
                )}

                <div className="h-6 w-px bg-glass-border"></div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium flex items-center gap-1">
                        <User size={16} className="text-accent" /> {user.name}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
