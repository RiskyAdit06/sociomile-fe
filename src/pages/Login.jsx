import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/login', { email, password });
            
            // 1. Simpan Token
            const token = data.access_token;
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', data.refresh_token);
            
            // 2. Decode Token untuk ambil role & nama asli
            const decoded = jwtDecode(token);
            localStorage.setItem('role', decoded.role); // Ambil 'agent' atau 'admin' dari token
            localStorage.setItem('user_name', decoded.name || 'User');

            navigate('/');
        } catch (err) {
            alert('Login gagal! Periksa kembali email dan password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-100 overflow-hidden border border-white">
                <div className="p-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                            <ShieldCheck size={32} />
                        </div>
                    </div>
                    
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sociomile 2.0</h1>
                        <p className="text-slate-400 mt-2 font-medium">Omnichannel Support System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-slate-700"
                                placeholder="name@company.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-slate-700"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </button>
                    </form>
                </div>
                
                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-400 font-medium italic">Sociomile Engineering Assignment</p>
                </div>
            </div>
        </div>
    );
}