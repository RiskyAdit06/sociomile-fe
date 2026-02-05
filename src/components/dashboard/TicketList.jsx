import { Search, Plus, Hash } from 'lucide-react';

export default function TicketList({ tickets, selectedId, onSelect, onAddClick }) {
    return (
        <section className="w-full md:w-[380px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            <div className="p-6 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter">Messages</h1>
                    {localStorage.getItem('role') !== 'agent' && (
                        <button 
                            onClick={onAddClick}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-2xl border-none outline-none text-sm font-semibold" 
                        placeholder="Search tickets..." 
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                {tickets.map(t => (
                    <div 
                        key={t.id} 
                        onClick={() => onSelect(t)} 
                        className={`mx-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                            selectedId === t.id ? 'bg-blue-50 border-blue-100 shadow-sm' : 'border-transparent hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Hash size={10} className="inline"/>{t.id}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${t.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                {t.priority}
                            </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 truncate">{t.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 italic">{t.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}