import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import TicketList from '../components/dashboard/TicketList';
import { Send, Loader2, X, MessageSquare, CheckSquare, ChevronDown } from 'lucide-react';

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'low' });

    const chatEndRef = useRef(null);
    const statusMenuRef = useRef(null); // Ref untuk menu status
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false); // State untuk menu status

    useEffect(() => { fetchTickets(); }, []);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    // Tutup menu status saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
                setIsStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets');
            setTickets(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSelectTicket = (ticket) => {
        setSelectedTicket(ticket);
        setLoadingChat(true);
        fetchConversations(ticket.id);
    };

    const fetchConversations = async (id) => {
        try {
            const res = await api.get(`/tickets/${id}/conversations`);
            const chatData = res.data.data || res.data;
            setMessages(Array.isArray(chatData) ? chatData : []);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoadingChat(false); 
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tickets', formData);
            setIsModalOpen(false);
            fetchTickets();
            setFormData({ title: '', description: '', priority: 'low' });
        } catch (err) { alert("Gagal buat tiket"); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await api.post(`/tickets/${selectedTicket.id}/conversations`, { message: newMessage });
            setNewMessage('');
            fetchConversations(selectedTicket.id); // Refresh chat
        } catch (err) { alert("Gagal kirim"); }
    };

    // Fungsi untuk mengubah status tiket
    const handleChangeTicketStatus = async (newStatus) => {
        if (!selectedTicket) return;
        try {
            await api.put(`/tickets/${selectedTicket.id}/status`, { status: newStatus });
            // Update status di UI secara lokal atau fetch ulang tiket
            setSelectedTicket(prev => ({ ...prev, status: newStatus }));
            fetchTickets(); // Refresh list tiket agar status di sidebar juga update
            setIsStatusMenuOpen(false); // Tutup menu setelah ganti status
        } catch (err) {
            alert("Gagal mengubah status tiket.");
            console.error(err);
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-600';
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            case 'resolved': return 'bg-emerald-100 text-emerald-600';
            case 'closed': return 'bg-slate-100 text-slate-500';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <Layout>
            <div className="flex h-full w-full bg-white overflow-hidden">
                <TicketList 
                    tickets={tickets} 
                    selectedId={selectedTicket?.id} 
                    onSelect={handleSelectTicket} 
                    onAddClick={() => setIsModalOpen(true)}
                />

                <section className="flex-1 flex flex-col bg-white">
                    {selectedTicket ? (
                        <>
                            <header className="px-8 h-20 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                                        {selectedTicket.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800">{selectedTicket.title}</h2>
                                        {/* Dropdown Status Tiket */}
                                        <div className="relative" ref={statusMenuRef}>
                                            <button 
                                                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mt-1 flex items-center gap-1 transition-all ${getStatusColorClass(selectedTicket.status)}`}
                                            >
                                                <CheckSquare size={12} className="inline" /> 
                                                <span>{selectedTicket.status}</span>
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isStatusMenuOpen && (
                                                <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-slate-100 rounded-lg shadow-lg z-30 animate-in fade-in slide-in-from-top-2">
                                                    {['open', 'pending', 'resolved', 'closed'].map(statusOption => (
                                                        <button 
                                                            key={statusOption}
                                                            onClick={() => handleChangeTicketStatus(statusOption)}
                                                            className={`block w-full text-left px-4 py-2 text-sm capitalize hover:bg-slate-50 ${selectedTicket.status === statusOption ? 'font-bold text-blue-600' : 'text-slate-700'}`}
                                                        >
                                                            {statusOption}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </header>
                            
                            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/30">
                                {loadingChat ? (
                                    <div className="flex justify-center h-full items-center"><Loader2 className="animate-spin text-blue-600" /></div>
                                ) : (
                                    messages.map((m, i) => {
                                        const isMe = m.sender?.role === 'agent' || m.sender?.role === 'admin';
                                        return (
                                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                                <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                                                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                                }`}>
                                                    <p className="text-sm font-medium">{m.message}</p>
                                                    <p className={`text-[8px] mt-2 font-bold uppercase ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <footer className="p-6 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 p-2 rounded-2xl">
                                    <input 
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-semibold px-2" 
                                        placeholder="Tulis balasan..." 
                                        value={newMessage} 
                                        onChange={(e)=>setNewMessage(e.target.value)} 
                                    />
                                    <button type="submit" className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Send size={18} />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4"><MessageSquare size={32}/></div>
                            <p className="font-bold uppercase text-[10px] tracking-[0.2em]">Pilih tiket untuk mulai percakapan</p>
                        </div>
                    )}
                </section>
            </div>

            {/* MODAL TAMBAH TIKET */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Buat Tiket Baru</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                <input required className="w-full p-4 bg-slate-50 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold" 
                                    onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea required className="w-full p-4 bg-slate-50 rounded-2xl mt-1 outline-none h-32 font-semibold resize-none"
                                    onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl mt-1 font-semibold outline-none appearance-none" 
                                    onChange={e => setFormData({...formData, priority: e.target.value})}>
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 mt-4">CREATE TICKET</button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}