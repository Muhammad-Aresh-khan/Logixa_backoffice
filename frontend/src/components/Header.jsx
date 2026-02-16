import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from './ui/breadcrumb';

const Header = () => {
    const location = useLocation();

    const getBreadcrumbs = () => {
        const segments = location.pathname.split("/").filter(Boolean);
        return segments.map((segment, index) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            href: "/" + segments.slice(0, index + 1).join("/"),
        }));
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="h-20 bg-[#1A1D21]/80 backdrop-blur-xl border-b border-[#31373E] flex items-center px-8 z-30">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard" className="text-slate-500 hover:text-[#26A69A] flex items-center gap-2 transition-colors">
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.slice(1).map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            <BreadcrumbSeparator className="text-slate-700">
                                <ChevronRight className="w-4 h-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                {index === breadcrumbs.length - 2 ? (
                                    <BreadcrumbPage className="text-[#26A69A] font-bold tracking-tight">
                                        {crumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={crumb.href} className="text-slate-500 hover:text-[#26A69A] transition-colors">
                                            {crumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
};

export default Header;
