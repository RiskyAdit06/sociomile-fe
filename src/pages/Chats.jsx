import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import TicketList from '../components/dashboard/TicketList';
import { Send, Loader2, X, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'low' });
    const chatEndRef = useRef(null);

    useEffect(() => { fetchTickets(); }, []);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
        } catch (err) { console.error(err); } 
        finally { setLoadingChat(false); }
    };

    // FUNGSI UPDATE STATUS TIKET
    const updateStatus = async (newStatus) => {
        try {
            await api.put(`/tickets/${selectedTicket.id}/status`, { status: newStatus });
            setSelectedTicket({...selectedTicket, status: newStatus});
            fetchTickets(); // refresh list sidebar
            setShowStatusMenu(false);
        } catch (err) { alert("Gagal update status"); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await api.post(`/tickets/${selectedTicket.id}/conversations`, { message: newMessage });
            setNewMessage('');
            fetchConversations(selectedTicket.id);
        } catch (err) { alert("Gagal kirim"); }
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
                            <header className="px-8 h-20 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
                                        {selectedTicket.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800">{selectedTicket.title}</h2>
                                        
                                        {/* DROPDOWN STATUS */}
                                        <div className="relative inline-block mt-1">
                                            <button 
                                                onClick={() => setShowStatusMenu(!showStatusMenu)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    selectedTicket.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                    selectedTicket.status === 'closed' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}
                                            >
                                                <CheckCircle2 size={12}/> {selectedTicket.status} <ChevronDown size={12}/>
                                            </button>

                                            {showStatusMenu && (
                                                <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                                                    {['open', 'pending', 'resolved', 'closed'].map(s => (
                                                        <button 
                                                            key={s} onClick={() => updateStatus(s)}
                                                            className="w-full text-left px-4 py-2 text-xs font-bold uppercase text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                                        >
                                                            {s}
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
                                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                                                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                                }`}>
                                                    <p className="text-sm font-medium">{m.message}</p>
                                                    <p className="text-[8px] mt-2 font-bold uppercase opacity-50 text-right">
                                                        {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <footer className="p-6 border-t border-slate-100 bg-white">
                                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 p-2 rounded-2xl">
                                    <input 
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-semibold px-2" 
                                        placeholder="Tulis balasan tiket..." 
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
                            <MessageSquare size={32} className="mb-4 opacity-20"/>
                            <p className="font-bold uppercase text-[10px] tracking-widest">Pilih tiket untuk dikelola</p>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
}