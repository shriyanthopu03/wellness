import React from 'react';
import { FileText, Download, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const Reports = ({ userContext }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <ReportActionCard icon={<FileText />} title="Weekly Report" date="Oct 2023 - Week 4" primary />
                 <ReportActionCard icon={<FileText className="text-gray-400"/>} title="Monthly Summary" date="September 2023" />
                 <ReportActionCard icon={<TrendingUp className="text-gray-400"/>} title="Health Outlook" date="AI Generated" />
                 <ReportActionCard icon={<Calendar className="text-gray-400"/>} title="Lab Results" date="Aug 12, 2023" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Health Score Trends</h3>
                        <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Aggregated data from all sensors</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors">
                        <Download size={16} /> Export PDF
                    </button>
                </div>

                <div className="space-y-8">
                    <ReportRow label="Cardiovascular Health" score={85} trend="+2%" color="red" />
                    <ReportRow label="Metabolic Stability" score={72} trend="-1%" color="orange" />
                    <ReportRow label="Sleep Pattern Score" score={94} trend="+8%" color="brand" />
                    <ReportRow label="Stress Management" score={68} trend="Stable" color="purple" />
                </div>
            </div>

            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex gap-4">
                <div className="p-3 bg-white rounded-2xl text-red-500 shadow-sm self-start">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-red-900">Health Alert: Vitamin D Insight</h4>
                    <p className="text-sm text-red-700 mt-1 leading-relaxed">
                        Based on your low energy reported this week and limited outdoor activity (GPS data), your Vitamin D levels might be dropping. Consider a light walk or dietary adjustment.
                    </p>
                    <button className="mt-4 text-xs font-black text-red-900 underline uppercase tracking-widest">Schedule Blood Test</button>
                </div>
            </div>
        </div>
    );
};

const ReportActionCard = ({ icon, title, date, primary }) => (
    <div className={`p-6 rounded-3xl border transition-all cursor-pointer ${primary ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-white border-gray-100 hover:border-brand-light shadow-sm'}`}>
        <div className={`p-3 rounded-2xl w-fit mb-4 ${primary ? 'bg-white/20' : 'bg-gray-50'}`}>{icon}</div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${primary ? 'opacity-70' : 'text-gray-400'}`}>{date}</p>
    </div>
);

const ReportRow = ({ label, score, trend, color }) => (
    <div className="flex items-center gap-6">
        <div className="w-40">
            <h5 className="font-bold text-gray-700 text-sm whitespace-nowrap">{label}</h5>
            <span className={`text-[10px] font-bold uppercase ${trend.includes('+') ? 'text-green-500' : trend.includes('-') ? 'text-red-500' : 'text-gray-400'}`}>
                {trend} vs last month
            </span>
        </div>
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
                className={`h-full bg-${color === 'brand' ? 'brand' : color + '-500'} rounded-full transition-all duration-1000`} 
                style={{ width: `${score}%` }}
            ></div>
        </div>
        <span className="font-black text-gray-900 w-12 text-right">{score}</span>
    </div>
);

export default Reports;
