import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
    LayoutDashboard,
    Users,
    KeyRound,
    LogOut,
    X,
    Menu,
    ChevronDown,
    Settings,
    ShieldCheck
} from 'lucide-react';
import LogixaLogo from './LogixaLogo';

const Sidebar = ({ sidebarOpen, setSidebarOpen, onCloseMobile }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedMenus, setExpandedMenus] = useState({});

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const toggleMenu = (label) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const menuItems = [
        {
            label: "Dashboard",
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            label: "Organizations",
            icon: Users,
            submenu: [
                { label: "View Organizations", path: '/dashboard/view-orgs' },
                { label: "Create Organization", path: '/dashboard/create-org' },
            ]
        },
        {
            label: "Licenses",
            icon: KeyRound,
            submenu: [
                { label: "View Licenses", path: '/dashboard/view-licenses' },
                { label: "Renew License", path: '/dashboard/renew-license' },
            ]
        }
    ];

    return (
        <aside
            className={cn(
                "bg-[#24282D] border-r border-[#31373E] transition-all duration-300 flex flex-col h-full shadow-2xl relative z-40",
                sidebarOpen ? "w-64" : "w-20"
            )}
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-[#31373E]">
                {sidebarOpen ? (
                    <LogixaLogo className="scale-75 origin-left" />
                ) : (
                    <div className="w-10 h-10 bg-[#26A69A]/10 rounded-xl flex items-center justify-center border border-[#26A69A]/20">
                        <ShieldCheck className="w-6 h-6 text-[#26A69A]" />
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-slate-500 hover:text-[#26A69A] hover:bg-[#26A69A]/10"
                >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isItemActive = item.path ? isActive(item.path) : false;
                    const hasSubmenu = !!item.submenu;
                    const isExpanded = expandedMenus[item.label] || (hasSubmenu && item.submenu.some(si => isActive(si.path)));

                    if (hasSubmenu) {
                        return (
                            <div key={item.label}>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleMenu(item.label)}
                                    className={cn(
                                        "w-full justify-start transition-all duration-200",
                                        isExpanded || (hasSubmenu && item.submenu.some(si => isActive(si.path)))
                                            ? "bg-[#26A69A]/10 text-[#26A69A]"
                                            : "text-slate-400 hover:text-[#26A69A] hover:bg-[#26A69A]/5"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {sidebarOpen && (
                                        <>
                                            <span className="ml-3 flex-1 text-left font-medium">{item.label}</span>
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4 transition-transform duration-200",
                                                    isExpanded ? "rotate-180" : ""
                                                )}
                                            />
                                        </>
                                    )}
                                </Button>
                                {sidebarOpen && isExpanded && (
                                    <div className="ml-4 mt-1 space-y-1 border-l border-[#31373E] pl-3">
                                        {item.submenu.map((subitem) => (
                                            <Link key={subitem.path} to={subitem.path}>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start text-xs h-9 font-medium",
                                                        isActive(subitem.path)
                                                            ? "text-[#26A69A] bg-[#26A69A]/10 border-r-2 border-[#26A69A]"
                                                            : "text-slate-500 hover:text-[#26A69A] hover:bg-[#26A69A]/5"
                                                    )}
                                                >
                                                    {subitem.label}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link key={item.path} to={item.path}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start transition-all duration-200",
                                    isItemActive
                                        ? "bg-[#26A69A] text-white shadow-[0_0_15px_rgba(38,166,154,0.3)]"
                                        : "text-slate-400 hover:text-[#26A69A] hover:bg-[#26A69A]/5"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-[#31373E]">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer group"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
