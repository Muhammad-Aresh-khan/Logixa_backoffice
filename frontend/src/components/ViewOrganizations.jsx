import { useState, useEffect } from 'react';
import { viewOrganizations, updateBilling } from '../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Edit2, Loader2, Mail, Users, Filter, X, Check, Building2, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const ViewOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrg, setEditingOrg] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const data = await viewOrganizations();
            // Assuming message contains the list of tuples
            setOrganizations(data.message || []);
        } catch (err) {
            console.error('Failed to fetch organizations', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (org) => {
        setEditingOrg(org[0]); // name
        setNewStatus(org[8] || ''); // billing
    };

    const handleSaveBilling = async (orgName) => {
        try {
            const result = await updateBilling(orgName, newStatus);
            if (result.error) {
                setNotification({ type: 'error', message: result.error });
            } else {
                setNotification({ type: 'success', message: 'Registry updated successfully' });
                setEditingOrg(null);
                fetchOrganizations();
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (err) {
            console.error('Failed to update billing status', err);
            setNotification({ type: 'error', message: 'Sync failed' });
        }
    };

    const filteredOrgs = organizations.filter(org =>
        org[0]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org[1]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">Organization <span className="text-[#26A69A]">Registry</span>.</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Enterprise licensing management & audit trail</p>
                </div>

                <div className="relative group w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#26A69A] transition-colors" />
                    <Input
                        placeholder="Search registry..."
                        className="pl-10 w-full sm:w-[300px] bg-[#24282D] border-[#31373E] text-white focus:border-[#26A69A] focus:ring-[#26A69A]/10 font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 rounded-xl border flex items-center gap-3 ${notification.type === 'error'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-[#26A69A]/10 border-[#26A69A]/20 text-[#26A69A]'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-current/10`}>
                            {notification.type === 'error' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </div>
                        <span className="font-bold text-sm tracking-wide uppercase">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <GlassCard className="p-0 overflow-hidden border-[#31373E]/50" hover={false}>
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-[#1A1D21]/50 border-b border-[#31373E]">
                            <TableRow className="hover:bg-transparent border-[#31373E]">
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-5 pl-8">Organization</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Admin Email</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Plan Tier</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">License Usage</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Service Timeline</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pr-8">Payment Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#26A69A]" />
                                            <span className="font-bold tracking-widest text-[10px] uppercase">Decrypting Table Data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrgs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500 italic">
                                        Search returned zero results in the current directory.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrgs.map((org, index) => (
                                    <TableRow key={index} className="border-[#31373E] hover:bg-[#26A69A]/5 transition-colors group">
                                        <TableCell className="py-5 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#26A69A]/5 border border-[#26A69A]/10 flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-[#26A69A]" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-white group-hover:text-[#26A69A] transition-colors tracking-tight">
                                                        {org[0]}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-600 uppercase mt-0.5">
                                                        Enterprise ID: {org[0].slice(0, 3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-400 font-medium font-mono text-sm leading-none">
                                            {org[1]}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-[#26A69A]/20 text-[#26A69A] bg-[#26A69A]/5 font-black uppercase text-[10px]">
                                                {org[2]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between w-32 mb-1">
                                                    <span className="text-white font-black text-2xl leading-none shadow-glow">{org[4] || 0}</span>
                                                    <span className="text-slate-400 font-black text-[11px] tracking-tight">
                                                        / <span className="text-[#26A69A]">{org[3]}</span> MAX
                                                    </span>
                                                </div>
                                                <div className="w-32 h-1.5 bg-[#1A1D21] border border-[#31373E] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(((org[4] || 0) / org[3]) * 100, 100)}%` }}
                                                        className="h-full bg-gradient-to-r from-[#26A69A] to-[#1DE9B6] shadow-[0_0_10px_#26A69A]"
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="bg-[#1A1D21] border border-[#31373E] rounded-md px-2 py-1 flex items-center gap-2 w-fit">
                                                    <CalendarIcon className="w-3 h-3 text-blue-400" />
                                                    <span className="text-[11px] font-black text-slate-300 font-mono tracking-tighter uppercase whitespace-nowrap">START: {org[5]}</span>
                                                </div>
                                                <div className="bg-[#1A1D21] border border-[#31373E] rounded-md px-2 py-1 flex items-center gap-2 w-fit">
                                                    <CalendarIcon className="w-3 h-3 text-red-400" />
                                                    <span className="text-[11px] font-black text-red-500/80 font-mono tracking-tighter uppercase whitespace-nowrap">EXPIRY: {org[6]}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center">
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-inner ${org[7]?.toLowerCase() === 'active'
                                                    ? 'bg-[#26A69A] text-white'
                                                    : 'bg-slate-800 text-slate-500 border border-[#31373E]'
                                                    }`}>
                                                    {org[7]}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8">
                                            <div className="flex items-center gap-3 justify-end">
                                                {editingOrg === org[0] ? (
                                                    <div className="flex items-center gap-2">
                                                        <Select value={newStatus} onValueChange={setNewStatus}>
                                                            <SelectTrigger className="h-9 w-28 bg-[#1A1D21] border-[#26A69A]/30 text-white text-[10px] font-black uppercase tracking-widest">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-[#1A1D21] border-[#31373E] text-white">
                                                                <SelectItem value="PAID" className="text-[10px] font-bold uppercase tracking-widest text-[#26A69A]">PAID</SelectItem>
                                                                <SelectItem value="UNPAID" className="text-[10px] font-bold uppercase tracking-widest text-red-400">UNPAID</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            size="sm"
                                                            className="h-9 bg-[#26A69A] hover:bg-[#26A69A]/90 min-w-[70px] font-black uppercase text-[10px] tracking-widest"
                                                            onClick={() => handleSaveBilling(org[0])}
                                                        >
                                                            COMMIT
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-500 hover:text-white"
                                                            onClick={() => setEditingOrg(null)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${org[8]?.toUpperCase() === 'PAID'
                                                            ? 'bg-blue-500/5 border-blue-500/20 text-blue-400'
                                                            : org[8]?.toUpperCase() === 'PENDING'
                                                                ? 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                                                                : 'bg-red-500/5 border-red-500/20 text-red-400'
                                                            }`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${org[8]?.toUpperCase() === 'PAID' ? 'bg-blue-400' : org[8]?.toUpperCase() === 'PENDING' ? 'bg-amber-400' : 'bg-red-400'
                                                                }`} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest shadow-glow-sm">
                                                                {org[8] || 'UNPAID'}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-600 hover:text-[#26A69A] hover:bg-[#26A69A]/10 transition-colors"
                                                            onClick={() => handleEditClick(org)}
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                )}
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

export default ViewOrganizations;
