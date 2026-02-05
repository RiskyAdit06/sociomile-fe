import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Ticket, MessageSquare, User } from 'lucide-react';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    // AMBIL DATA DARI LOCAL STORAGE
    const role = localStorage.getItem('role') || 'User'; 
    const userName = localStorage.getItem('user_name') || 'Username';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
            <aside className="w-64 bg-[#0f172a] flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                    <span className="text-white font-black tracking-tighter text-lg">SOCIOMILE</span>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
                    <button onClick={() => navigate('/')} className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <Ticket size={20} className="mr-3" /> <span className="text-sm font-semibold">Tickets</span>
                    </button>
                    <button onClick={() => navigate('/chats')} className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${location.pathname === '/chats' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <MessageSquare size={20} className="mr-3" /> <span className="text-sm font-semibold">Chats</span>
                    </button>
                </nav>

                {/* BAGIAN PROFIL (Kotak Merah di Gambar) */}
                <div className="p-4 mt-auto">
                    <div className="bg-slate-800/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                                <User size={20} />
                            </div>
                            <div className="overflow-hidden">
                                {/* Tampilkan Role & Nama dari storage */}
                                <p className="text-sm font-bold text-white truncate uppercase">
                                    {role} 
                                </p>
                                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase truncate">
                                    {userName}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full py-2.5 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all border border-rose-500/20"
                        >
                            <LogOut className="mr-2" size={14} /> LOGOUT
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative overflow-hidden flex flex-col bg-white">
                {children}
            </main>
        </div>
    );
}