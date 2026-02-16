import { useState, useEffect } from 'react';
import { renewLicense, getPackages, viewLicenses } from '../services/api';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select"
import {
    KeyRound,
    Building,
    Package,
    Loader2,
    RefreshCcw,
    Download,
    Check,
    Copy,
    Calendar,
    Key,
    Activity,
    Search,
    Zap,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const RenewLicense = () => {
    const [formData, setFormData] = useState({
        organization_name: '',
        packages: '',
        license_key: '',
    });
    const [packages, setPackages] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingLicenses, setFetchingLicenses] = useState(false);
    const [orgLicenses, setOrgLicenses] = useState([]);
    const [notification, setNotification] = useState(null);
    const [renewedLicense, setRenewedLicense] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await getPackages();
            setPackages(data.packages || {});
        } catch (err) {
            console.error('Failed to fetch packages', err);
        }
    };

    const handleFetchLicenses = async () => {
        if (!formData.organization_name) {
            setNotification({ type: 'error', message: 'Enter target node identifier.' });
            return;
        }

        setFetchingLicenses(true);
        setNotification(null);
        setOrgLicenses([]);

        try {
            const result = await viewLicenses(formData.organization_name);
            if (result.message && Array.isArray(result.message)) {
                if (result.message.length === 0) {
                    setNotification({ type: 'error', message: 'No protocols found for this node.' });
                } else {
                    const formatted = result.message.map(row => ({
                        license_key: row[0],
                        package_name: row[1],
                        organization_name: row[2],
                        issue_date: row[3],
                        expiry_date: row[4],
                        status: row[5]
                    }));
                    setOrgLicenses(formatted);
                    setNotification({ type: 'success', message: `Found ${formatted.length} encryption records.` });
                }
            } else {
                setNotification({ type: 'error', message: result.error || 'Protocol sync failed.' });
            }
        } catch (err) {
            console.error('Fetch licenses error:', err);
            setNotification({ type: 'error', message: 'Network synchronization error.' });
        } finally {
            setFetchingLicenses(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFetchLicenses();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'organization_name') {
            setOrgLicenses([]);
            setFormData(prev => ({ ...prev, license_key: '' }));
        }
    }

    const handleSelectPackage = (value) => {
        setFormData({
            ...formData,
            packages: value,
        });
    };

    const handleSelectLicense = (value) => {
        setFormData({
            ...formData,
            license_key: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);
        setRenewedLicense(null);

        try {
            const result = await renewLicense(formData);

            if (result.error) {
                setNotification({ type: 'error', message: result.error });
            } else {
                setNotification({
                    type: 'success',
                    message: 'Protocol extension complete.',
                });
                if (result.license) {
                    setRenewedLicense(result.license);
                }
            }
        } catch (err) {
            console.error('Renew license error:', err);
            setNotification({
                type: 'error',
                message: 'Internal sync failure.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (key) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleDownload = () => {
        if (!renewedLicense) return;

        let text = `LOGIXA - EXTENDED LICENSE DETAILS\n`;
        text += `Organization: ${renewedLicense.organization}\n`;
        text += `Updated: ${new Date().toISOString()}\n`;
        text += `==========================================\n\n`;
        text += `KEY: ${renewedLicense.key}\n`;
        text += `PLAN: ${renewedLicense.package}\n`;
        text += `NEW EXPIRY: ${renewedLicense.expiry_date}\n`;
        text += `==========================================\n`;

        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `RENEWAL_${renewedLicense.organization}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-white tracking-tight">Access <span className="text-[#26A69A]">Renewal</span>.</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">ENTERPRISE LICENSE EXTENSION & PROTOCOL UPDATE</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <GlassCard className="p-10 border-[#31373E]/50" hover={false}>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Building className="w-3.5 h-3.5" /> target organization
                                </label>
                                <div className="flex gap-3">
                                    <Input
                                        name="organization_name"
                                        value={formData.organization_name}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter name..."
                                        className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-12 font-bold"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleFetchLicenses}
                                        disabled={fetchingLicenses || !formData.organization_name}
                                        className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-black uppercase text-xs"
                                    >
                                        {fetchingLicenses ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <KeyRound className="w-3.5 h-3.5" /> active license keys
                                </label>
                                <Select
                                    value={formData.license_key}
                                    onValueChange={handleSelectLicense}
                                    disabled={orgLicenses.length === 0}
                                >
                                    <SelectTrigger className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-14 font-bold">
                                        <SelectValue placeholder={orgLicenses.length > 0 ? "Select Active License" : "No organization identified"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1D21] border-[#31373E] text-white max-h-[400px]">
                                        {orgLicenses.map((lsc) => (
                                            <SelectItem key={lsc.license_key} value={lsc.license_key} className="focus:bg-[#26A69A]/10 py-4 border-b border-[#31373E] last:border-0 overflow-hidden">
                                                <div className="flex flex-col gap-2 max-w-[300px]">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <code className="text-[#26A69A] font-mono text-[10px] break-all truncate">{lsc.license_key.slice(0, 20)}...</code>
                                                        <Badge variant="outline" className="text-[8px] font-black border-[#26A69A]/20 text-[#26A69A]">
                                                            {lsc.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                                        <span>{lsc.package_name}</span>
                                                        <span className="text-red-400/70">Exp: {lsc.expiry_date}</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" /> New Extension Protocol
                                </label>
                                <Select
                                    value={formData.packages}
                                    onValueChange={handleSelectPackage}
                                >
                                    <SelectTrigger className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-12 font-bold">
                                        <SelectValue placeholder="Select Extension Tier" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1D21] border-[#31373E] text-white">
                                        {Object.keys(packages).map((pkg) => (
                                            <SelectItem key={pkg} value={pkg} className="focus:bg-[#26A69A]/10">
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{pkg}</span>
                                                    <span className="text-[10px] opacity-50 uppercase">{packages[pkg]} Days Extension</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#26A69A] hover:bg-[#26A69A]/90 text-white font-black h-14 rounded-xl shadow-[0_0_20px_#26A69A]/20 transition-all uppercase tracking-widest"
                                disabled={loading || !formData.packages || !formData.license_key}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                        Extending Access...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 mr-3" />
                                        Sync Renewal
                                    </>
                                )}
                            </Button>
                        </form>
                    </GlassCard>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <AnimatePresence>
                        {notification && !renewedLicense && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-6 rounded-3xl border ${notification.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                    : 'bg-[#26A69A]/10 border-[#26A69A]/20 text-[#26A69A]'
                                    }`}
                            >
                                <h4 className="font-black text-xs uppercase mb-1">Matrix Status</h4>
                                <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1">
                        {renewedLicense ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <GlassCard className="border-[#26A69A]/30 bg-[#26A69A]/5" hover={false}>
                                    <div className="text-center space-y-4 py-4">
                                        <div className="w-16 h-16 bg-[#26A69A] rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_20px_#26A69A]/40">
                                            <Check className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-white font-black uppercase text-sm tracking-widest">Renewal Success</h3>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Encryption protocols synchronized</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#1A1D21] p-4 rounded-2xl border border-[#31373E] space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                                            <span>Target: {renewedLicense.organization}</span>
                                            <button onClick={() => handleCopy(renewedLicense.key)} className="hover:text-[#26A69A] transition-colors">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <code className="block font-mono text-xs text-[#26A69A] break-all leading-relaxed">
                                            {renewedLicense.key}
                                        </code>
                                        <div className="pt-3 border-t border-[#31373E] grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-slate-600 uppercase">Extension</span>
                                                <div className="text-white text-xs font-bold leading-none">{renewedLicense.package}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-[#26A69A]">New Expiry</span>
                                                <div className="text-[#26A69A] text-xs font-black shadow-glow">{renewedLicense.expiry_date}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleDownload}
                                        className="w-full mt-6 bg-[#24282D] hover:bg-[#31373E] text-white border border-[#31373E] h-12 font-bold text-xs uppercase"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Download TXT
                                    </Button>
                                </GlassCard>
                            </motion.div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-[#31373E] rounded-[40px] flex flex-col items-center justify-center text-center p-8 text-slate-600 gap-4 opacity-50">
                                <Activity className="w-12 h-12" />
                                <div className="space-y-1">
                                    <h4 className="font-black uppercase text-[10px]">Real-time Telemetry</h4>
                                    <p className="text-[9px] max-w-[150px] mx-auto">Select a protocol key to view its current encryption status and expiration matrix.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenewLicense;
