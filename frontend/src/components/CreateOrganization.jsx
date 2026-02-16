import { useState, useEffect } from 'react';
import { createOrganization, getPackages } from '../services/api';
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
    Building2,
    Mail,
    Package,
    Hash,
    Loader2,
    Download,
    Copy,
    Check,
    Key,
    ExternalLink,
    Terminal,
    Zap,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const CreateOrganization = () => {
    const [formData, setFormData] = useState({
        organization_name: '',
        organization_email: '',
        package_type: '',
        lsc_limit: 1,
    });
    const [packages, setPackages] = useState({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [generatedLicenses, setGeneratedLicenses] = useState(null);
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (value) => {
        setFormData({
            ...formData,
            package_type: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);
        setGeneratedLicenses(null);

        try {
            const submissionData = {
                ...formData,
                lsc_limit: parseInt(formData.lsc_limit),
            };

            const result = await createOrganization(submissionData);

            if (result.error) {
                setNotification({ type: 'error', message: result.error });
            } else {
                setNotification({
                    type: 'success',
                    message: 'Protocol initialization complete.',
                });
                if (result.licenses) {
                    setGeneratedLicenses(result.licenses);
                }
                setFormData({
                    organization_name: '',
                    organization_email: '',
                    package_type: '',
                    lsc_limit: 1,
                });
            }
        } catch (err) {
            console.error('Create organization error:', err);
            setNotification({
                type: 'error',
                message: 'Internal synchronization failure.',
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
        if (!generatedLicenses) return;

        text += `LOGIXA - ENTERPRISE LICENSE KEYS\n`;
        text += `Organization: ${formData.organization_name || 'Organization'}\n`;
        text += `Timestamp: ${new Date().toISOString()}\n`;
        text += `==========================================\n\n`;

        generatedLicenses.forEach((lsc, idx) => {
            text += `[LICENSE #${idx + 1}]\n`;
            text += `TIER: ${lsc.package}\n`;
            text += `KEY: ${lsc.key}\n`;
            text += `ISSUED: ${lsc.issue_date}\n`;
            text += `EXPIRES: ${lsc.expiry_date}\n`;
            text += `------------------------------------------\n\n`;
        });

        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `LOGIXA_${formData.organization_name || 'org'}_keys.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-white tracking-tight">Organization <span className="text-[#26A69A]">Registration</span>.</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">ENTERPRISE NODE IDENTIFICATION & LICENSE GENERATION</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-8">

                    <GlassCard className="p-10 border-[#31373E]/50" hover={false}>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5" /> organization name
                                    </label>
                                    <Input
                                        name="organization_name"
                                        value={formData.organization_name}
                                        onChange={handleChange}
                                        placeholder="e.g. CYBERNETX"
                                        className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-12 font-bold"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> Primary Admin Email
                                    </label>
                                    <Input
                                        type="email"
                                        name="organization_email"
                                        value={formData.organization_email}
                                        onChange={handleChange}
                                        placeholder="admin@cybernetx.io"
                                        className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-12 font-bold font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Package className="w-3.5 h-3.5" /> service tier
                                    </label>
                                    <Select
                                        value={formData.package_type}
                                        onValueChange={handleSelectChange}
                                    >
                                        <SelectTrigger className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-12 font-bold">
                                            <SelectValue placeholder="Select Tier" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A1D21] border-[#31373E] text-white">
                                            {Object.keys(packages).map((pkg) => (
                                                <SelectItem key={pkg} value={pkg} className="focus:bg-[#26A69A]/10 focus:text-[#26A69A]">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{pkg}</span>
                                                        <span className="text-[10px] opacity-50 uppercase">{packages[pkg]} Days Access</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Hash className="w-3.5 h-3.5" /> License Count
                                    </label>
                                    <Input
                                        type="number"
                                        name="lsc_limit"
                                        value={formData.lsc_limit}
                                        onChange={handleChange}
                                        min="1"
                                        className="bg-[#1A1D21] border-[#31373E] text-white focus:border-[#26A69A] h-12 font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#26A69A] hover:bg-[#26A69A]/90 text-white font-black h-14 rounded-xl shadow-[0_0_20px_#26A69A]/20 transition-all uppercase tracking-widest"
                                disabled={loading || !formData.package_type}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                        Processing Protocol...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 mr-3" />
                                        Initialize Node
                                    </>
                                )}
                            </Button>
                        </form>
                    </GlassCard>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-6 rounded-3xl border ${notification.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                    : 'bg-[#26A69A]/10 border-[#26A69A]/20 text-[#26A69A]'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    < Sparkles className="w-5 h-5" />
                                    <h4 className="font-black uppercase tracking-widest text-xs">System Feedback</h4>
                                </div>
                                <p className="font-bold text-sm">{notification.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {generatedLicenses ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-white uppercase text-xs tracking-widest">Active Keys</h3>
                                        <Button
                                            onClick={handleDownload}
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#26A69A] hover:bg-[#26A69A]/10 font-bold text-[10px] uppercase"
                                        >
                                            <Download className="w-3 h-3 mr-2" /> Export
                                        </Button>
                                    </div>

                                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                        {generatedLicenses.map((lsc, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-[#24282D] border border-[#31373E] rounded-2xl p-5 space-y-3 group hover:border-[#26A69A]/30 transition-all"
                                            >
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                                                    <span>Entry #{idx + 1}</span>
                                                    <button onClick={() => handleCopy(lsc.key)} className="hover:text-[#26A69A] transition-colors">
                                                        {copiedKey === lsc.key ? <Check className="w-3.5 h-3.5 text-[#26A69A]" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                                <code className="block font-mono text-xs text-[#26A69A] bg-[#1A1D21] p-2 rounded border border-[#31373E] break-all group-hover:bg-[#26A69A]/5 transition-colors">
                                                    {lsc.key}
                                                </code>
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                                    <span>Tier: {lsc.package}</span>
                                                    <span className="text-red-400/70">Exp: {lsc.expiry_date}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full border-2 border-dashed border-[#31373E] rounded-[40px] flex flex-col items-center justify-center text-center p-8 text-slate-600 gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-[#24282D] flex items-center justify-center border border-[#31373E] opacity-50">
                                        <Key className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black uppercase text-xs tracking-tighter">Waiting for Input</h4>
                                        <p className="text-[10px] max-w-[200px] mx-auto opacity-50">Enter organization details to generate unique encryption protocols.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrganization;
