import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Store, Users, LayoutDashboard, User, KeyRound, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-8 py-6 sm:py-10 flex justify-center pointer-events-none">
            <motion.nav 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="glass px-6 sm:px-10 py-3 sm:py-4 flex items-center justify-between sm:justify-center gap-4 sm:gap-16 pointer-events-auto rounded-[2rem] border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl w-full max-w-4xl"
            >
                <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="p-2 sm:p-3 bg-gradient-to-tr from-red-600 via-red-500 to-rose-700 rounded-2xl shadow-lg shadow-red-500/20 group-hover:rotate-[360deg] transition-transform duration-1000">
                        <Shield className="text-white" size={18} />
                    </div>
                    <span className="text-lg sm:text-2xl font-black tracking-[-0.05em] text-white uppercase italic font-display">
                        Jumbo<span className="text-red-500">Ship</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    {user.role === 'Admin' && (
                        <>
                            <NavLink to="/admin" icon={LayoutDashboard} label="Registry" active={isActive('/admin')} />
                            <NavLink to="/admin/stores" icon={Store} label="Nodes" active={isActive('/admin/stores')} />
                            <NavLink to="/admin/users" icon={Users} label="Identity" active={isActive('/admin/users')} />
                        </>
                    )}

                    {user.role === 'User' && (
                        <NavLink to="/user" icon={Store} label="Marketplace" active={isActive('/user')} />
                    )}

                    {user.role === 'StoreOwner' && (
                        <NavLink to="/store" icon={LayoutDashboard} label="Console" active={isActive('/store')} />
                    )}
                </div>

                <div className="flex items-center gap-3 sm:gap-8">
                    <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] border border-white/5 px-5 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                            {user.name.split(' ')[0]}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/update-password')}
                            className={`p-2.5 sm:p-3 rounded-2xl transition-all ${
                                isActive('/update-password') ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-white/5 text-text-muted hover:bg-white/10'
                            }`}
                        >
                            <KeyRound size={16} />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: -10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLogout}
                            className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/30"
                        >
                            <LogOut size={16} />
                        </motion.button>
                    </div>
                </div>
            </motion.nav>
            
            {/* Mobile Navigation Bar - Compact for better UX */}
            <div className="md:hidden fixed bottom-10 left-0 w-full px-6 flex justify-center pointer-events-none">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass flex items-center justify-around w-full max-w-sm px-6 py-4 pointer-events-auto rounded-[2.5rem] border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                >
                     {user.role === 'Admin' && (
                        <>
                            <MobileNavLink to="/admin" icon={LayoutDashboard} active={isActive('/admin')} />
                            <MobileNavLink to="/admin/stores" icon={Store} active={isActive('/admin/stores')} />
                            <MobileNavLink to="/admin/users" icon={Users} active={isActive('/admin/users')} />
                        </>
                    )}

                    {user.role === 'User' && (
                        <MobileNavLink to="/user" icon={Store} active={isActive('/user')} />
                    )}

                    {user.role === 'StoreOwner' && (
                        <MobileNavLink to="/store" icon={LayoutDashboard} active={isActive('/store')} />
                    )}
                    <MobileNavLink to="/update-password" icon={KeyRound} active={isActive('/update-password')} />
                </motion.div>
            </div>
        </div>
    );
};

const NavLink = ({ to, icon: Icon, label, active }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 px-6 py-2.5 rounded-full font-bold text-[11px] transition-all duration-700 relative group ${
            active 
            ? 'text-white' 
            : 'text-text-muted hover:text-white'
        }`}
    >
        {active && (
            <motion.div 
                layoutId="nav-bg"
                className="absolute inset-0 bg-red-600/10 rounded-full border border-red-600/10 shadow-inner"
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
            />
        )}
        <Icon size={14} className={`relative z-10 transition-all duration-500 ${active ? 'text-red-500 scale-110' : 'group-hover:scale-125'}`} />
        <span className="relative z-10 tracking-[0.2em] uppercase font-display italic">{label}</span>
    </Link>
);

const MobileNavLink = ({ to, icon: Icon, active }) => (
    <Link 
        to={to} 
        className={`p-4 rounded-2xl transition-all duration-500 relative ${
            active ? 'bg-red-600/20 text-red-500' : 'text-text-muted'
        }`}
    >
        {active && (
            <motion.div 
                layoutId="mobile-nav-indicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"
            />
        )}
        <Icon size={22} />
    </Link>
);

export default Navbar;
