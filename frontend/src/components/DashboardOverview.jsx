import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import GlassCard from './GlassCard';
import {
    Building2,
    CheckCircle2,
    AlertCircle,
    KeyRound,
    ShieldCheck,
    Ban
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, description, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <GlassCard className="group h-full">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</span>
                <div className={`p-3 rounded-xl bg-slate-800/50 ${colorClass} group-hover:bg-[#26A69A]/10 group-hover:text-[#26A69A] transition-all duration-300`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-4xl font-black text-white tracking-tight">{value}</div>
                <p className="text-xs text-slate-500 font-medium">{description}</p>
            </div>

            {/* Glow line at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </GlassCard>
    </motion.div>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        total_organizations: 0,
        active_organizations: 0,
        expired_organizations: 0,
        total_licenses: 0,
        active_licenses: 0,
        expired_licenses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getDashboardStats();
                if (data && !data.error) {
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        {
            title: "Total Organizations",
            value: stats.total_organizations,
            icon: Building2,
            description: "Enterprise connectivity status",
            colorClass: "text-blue-400"
        },
        {
            title: "Active Organizations",
            value: stats.active_organizations,
            icon: CheckCircle2,
            description: "Currently operational units",
            colorClass: "text-[#26A69A]"
        },
        {
            title: "Expired Organizations",
            value: stats.expired_organizations,
            icon: AlertCircle,
            description: "Requiring immediate renewal",
            colorClass: "text-red-400"
        },
        {
            title: "Total Licenses",
            value: stats.total_licenses,
            icon: KeyRound,
            description: "Global encryption keys issued",
            colorClass: "text-amber-400"
        },
        {
            title: "Active Licenses",
            value: stats.active_licenses,
            icon: ShieldCheck,
            description: "Valid security credentials",
            colorClass: "text-[#26A69A]"
        },
        {
            title: "Expired Licenses",
            value: stats.expired_licenses,
            icon: Ban,
            description: "Inactive protocol keys",
            colorClass: "text-slate-400"
        }
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-white transition-all duration-500">
                    System <span className="text-[#26A69A]">Overview</span>.
                </h1>
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Enterprise licensing telemetry and real-time statistics</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 bg-[#24282D]/50 border border-[#31373E] rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statItems.map((item, index) => (
                        <StatCard key={index} {...item} delay={index * 0.1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
