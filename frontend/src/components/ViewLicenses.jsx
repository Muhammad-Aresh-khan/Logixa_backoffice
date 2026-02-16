import { useState, useEffect } from 'react';
import { viewLicenses } from '../services/api';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Search, RefreshCcw, Key as KeyIcon, Loader2, Building2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const ViewLicenses = () => {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async (orgName = null) => {
        setLoading(true);
        try {
            const data = await viewLicenses(orgName);
            setLicenses(data.message || []);
        } catch (err) {
            console.error('Failed to fetch licenses', err);
            setNotification({ type: 'error', message: 'Failed to sync with matrix' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLicenses(searchTerm || null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">License <span className="text-[#26A69A]">Registry</span>.</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global audit trail of issued enterprise credentials</p>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#26A69A] transition-colors" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find by organization..."
                            className="pl-10 w-full sm:w-[250px] bg-[#24282D] border-[#31373E] text-white focus:border-[#26A69A] focus:ring-[#26A69A]/10"
                        />
                    </div>
                    <Button type="submit" className="bg-[#26A69A] hover:bg-[#26A69A]/90 font-bold">
                        Search
                    </Button>
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-white hover:bg-[#31373E]"
                            onClick={() => {
                                setSearchTerm('');
                                fetchLicenses(null);
                            }}
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </Button>
                    )}
                </form>
            </div>

            <GlassCard className="p-0 overflow-hidden border-[#31373E]/50" hover={false}>
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-[#1A1D21]/50 border-b border-[#31373E]">
                            <TableRow className="hover:bg-transparent border-[#31373E]">
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-5 pl-8">License Key</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Organization</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Subscription Plan</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Timeline</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right pr-8">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#26A69A]" />
                                            <span className="font-bold tracking-widest text-[10px] uppercase text-[#26A69A]">Accessing Registry...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : licenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500 italic">
                                        No encryption records found for the specified query.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                licenses.map((lsc, index) => (
                                    <TableRow key={index} className="border-[#31373E] hover:bg-[#26A69A]/5 transition-colors group">
                                        <TableCell className="py-5 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center border border-[#31373E] group-hover:border-[#26A69A]/30 transition-colors">
                                                    <KeyIcon className="w-4 h-4 text-slate-500 group-hover:text-[#26A69A]" />
                                                </div>
                                                <code className="font-mono text-xs text-[#26A69A] bg-[#26A69A]/5 px-2 py-1 rounded border border-[#26A69A]/10 select-all">
                                                    {lsc[0]}
                                                </code>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-white">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                                                {lsc[2]}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/5 font-bold uppercase text-[10px]">
                                                {lsc[1]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3 text-slate-600" />
                                                    {lsc[3]}
                                                </div>
                                                <span className="text-slate-800">→</span>
                                                <div className="flex items-center gap-1.5 text-red-500/70">
                                                    <Calendar className="w-3 h-3" />
                                                    {lsc[4]}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D21] border border-[#31373E] shadow-inner group-hover:border-[#26A69A]/20 transition-colors">
                                                <div className={`w-1.5 h-1.5 rounded-full ${lsc[5]?.toLowerCase() === 'active' ? 'bg-[#26A69A] shadow-[0_0_8px_#26A69A]' : 'bg-slate-600'}`} />
                                                <span className={`text-[10px] font-black uppercase ${lsc[5]?.toLowerCase() === 'active' ? 'text-white' : 'text-slate-500'}`}>
                                                    {lsc[5] || 'ACTIVE'}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </GlassCard>
        </div>
    );
};

export default ViewLicenses;
