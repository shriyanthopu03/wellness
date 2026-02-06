import React from 'react';
import { FileText, Download, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const Reports = ({ userContext }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <ReportActionCard icon={<FileText />} title="Weekly Analytics" date="W48 • SYNCHRONIZED" primary />
                 <ReportActionCard icon={<FileText />} title="Monthly Nexus" date="OCT 2023 • BUFFERED" />
                 <ReportActionCard icon={<TrendingUp />} title="Neural Outlook" date="AI GENERATED" />
                 <ReportActionCard icon={<Calendar />} title="Biometric Feed" date="AUG 12 • ARCHIVED" />
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter italic">Biometric Synchronization</h3>
                        <p className="text-slate-500 text-[10px] font-black mt-2 uppercase tracking-[0.4em]">Aggregated Real-time Neural Telemetry</p>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-slate-800 border border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-300 hover:text-brand hover:border-brand/30 transition-all shadow-xl">
                        <Download size={16} /> Data Export
                    </button>
                </div>

                <div className="space-y-10 relative z-10">
                    <ReportRow label="Cardiovascular" score={85} trend="+2%" color="from-red-500 to-rose-600" />
                    <ReportRow label="Metabolic Stability" score={72} trend="-1%" color="from-orange-500 to-amber-600" />
                    <ReportRow label="Neural Sleep Delta" score={94} trend="+8%" color="from-brand to-emerald-500" />
                    <ReportRow label="Stress Resonance" score={68} trend="STABLE" color="from-purple-500 to-violet-600" />
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl"></div>
                <div className="p-5 bg-red-500/10 text-red-500 rounded-[2rem] border border-red-500/20 shadow-xl shadow-red-500/5 self-start">
                    <AlertCircle size={32} />
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-red-400 uppercase tracking-tight text-xl italic mb-2">Neural Alert: Nutrient Depletion Detected</h4>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                        Biometric patterns indicate a high probability of Vitamin D deficiency aligned with reduced outdoor activity cycles. System recommends immediate solar exposure or targeted supplementation.
                    </p>
                    <button className="mt-6 px-8 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                        Initiate Clinical Diagnostic
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReportActionCard = ({ icon, title, date, primary }) => (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden cursor-pointer ${
        primary 
            ? 'bg-brand text-slate-950 border-brand shadow-2xl shadow-brand/20' 
            : 'bg-slate-900 border-slate-800 hover:border-brand/30 shadow-xl'
    }`}>
        <div className={`p-4 rounded-2xl w-fit mb-6 shadow-lg transition-transform group-hover:scale-110 ${
            primary ? 'bg-slate-950/10' : 'bg-slate-800 text-brand border border-slate-700'
        }`}>{icon}</div>
        <h4 className={`font-black uppercase tracking-tight italic mb-2 ${primary ? 'text-slate-950' : 'text-slate-100'}`}>{title}</h4>
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${primary ? 'text-slate-900/60' : 'text-slate-500'}`}>{date}</p>
    </div>
);

const ReportRow = ({ label, score, trend, color }) => (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
        <div className="w-48">
            <h5 className="font-black text-slate-300 uppercase tracking-tight italic mb-1">{label}</h5>
            <span className={`text-[9px] font-black uppercase tracking-widest ${
                trend.includes('+') ? 'text-emerald-400' : trend.includes('-') ? 'text-rose-400' : 'text-slate-500'
            }`}>
                {trend} VARIANCE
            </span>
        </div>
        <div className="flex-1 h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div 
                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.2)]`} 
                style={{ width: `${score}%` }}
            ></div>
        </div>
        <span className="font-black text-slate-100 w-16 text-2xl tracking-tighter italic text-right font-mono">{score}%</span>
    </div>
);

export default Reports;
