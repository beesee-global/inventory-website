import { NavLink, useLocation } from 'react-router-dom';
import React, { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronLeft, User2, LayoutDashboard, Settings, Wrench, MoreVertical } from 'lucide-react';
import { userAuth } from '../../hooks/userAuth';

interface ChildItem {
    id: string;
    name: string;
    path: string;
    icon?: ReactNode;
}

interface MenuItem {
    id: string;
    name: string;
    path?: string;
    icon?: ReactNode;
    children?: ChildItem[];
}

interface SidebarProps {
    setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setShowSidebar }) => {
    const location = useLocation();
    const { userInfo, isCollapsed, setIsCollapsed, setUserNav, logout } = userAuth();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    const dummyUserInfo = {
        name: 'John Doe',
        image_url: 'https://via.placeholder.com/150',
        position: 'Manager',
    };

    const dummyTheme = {
        backgroundColor: '#f0f0f0',
        textColor: '#333',
        hoverColor: '#ddd',
        activeColor: '#bbb',
        icon: '#333',
        image_url: 'https://via.placeholder.com/150',
    };

    const currentUser = {
        name: userInfo?.full_name || dummyUserInfo.name,
        image_url:
            typeof userInfo?.image === 'string' && userInfo.image
                ? userInfo.image
                : dummyUserInfo.image_url,
        position: userInfo?.role || dummyUserInfo.position,
    };

    const sidebarLayout: MenuItem[] = [
        { id: 'dashboard', name: 'Dashboard', path: '/main/dashboard', icon: <LayoutDashboard size={20} /> },
        {
            id: 'inventory',
            name: 'Inventory',
            icon: <User2 size={20} />,
            children: [
                { id: 'category', name: 'Category', path: '/main/category' },
                { id: 'product', name: 'Product', path: '/main/product' },
            ],
        },
        { id: 'supplier', name: 'Supplier', path: '/main/supplier', icon: <Wrench size={20} /> },
        {
            id: 'settings',
            name: 'Settings',
            icon: <Settings size={20} />,
            children: [{ id: 'theme', name: 'Theme', path: '/main/theme' }],
        },
    ];

    const toggleMenu = (id: string) => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setTimeout(() => {
                setOpenMenus((prev) => ({ ...prev, [id]: true }));
            }, 100);
        } else {
            setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
        }
    };

    const toggleCollapse = () => {
        if (window.innerWidth >= 768) {
            setIsCollapsed(!isCollapsed);
            if (!isCollapsed) setOpenMenus({});
        }
    };

    const closeMobileSidebar = () => {
        if (window.innerWidth < 768) {
            setShowSidebar?.(false);
            setUserNav(false);
        }
    };

    const handleLogout = () => {
        logout();
        setShowLogoutButton(false);
        closeMobileSidebar();
    };

    const isActivePath = (path?: string) =>
        !!path &&
        (location.pathname === path || location.pathname.startsWith(`${path}/`));

    useEffect(() => {
        const activeMenuState: Record<string, boolean> = {};

        sidebarLayout.forEach((item) => {
            if (item.children) {
                const activeChild = item.children.some((child) => isActivePath(child.path));
                if (activeChild) {
                    activeMenuState[item.id] = true;
                }
            }
        });

        setOpenMenus((prev) => ({ ...prev, ...activeMenuState }));
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsCollapsed]);

    return (
        <div
            className="flex min-h-screen flex-col justify-between border-r border-gray-800"
            style={{ backgroundColor: dummyTheme.backgroundColor, color: dummyTheme.textColor }}
        >
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: dummyTheme.textColor }}>
                                Menu
                            </h2>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={toggleCollapse}
                        className="hidden h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white hover:bg-white/10 md:inline-flex"
                        aria-label="Toggle sidebar collapse"
                    >
                        <ChevronLeft
                            size={18}
                            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                
                <div className='flex items-center justify-center w-full'>
                    <img
                        src={dummyTheme.image_url}
                        alt="Logo"
                        className="h-20 w-20 rounded-full"
                    />
                </div>

                <ul className="space-y-2">
                    {sidebarLayout.map((item) => {
                        const itemIsActive =
                            item.path ? isActivePath(item.path) :
                            item.children ? item.children.some((child) => isActivePath(child.path)) : false;
                        const menuOpen = !!openMenus[item.id];

                        return (
                            <li key={item.id}>
                                {item.children ? (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => toggleMenu(item.id)}
                                            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition"
                                            style={
                                                itemIsActive || menuOpen
                                                    ? {
                                                          backgroundColor: dummyTheme.activeColor,
                                                          color: dummyTheme.textColor,
                                                      }
                                                    : { color: dummyTheme.textColor }
                                            }
                                        >
                                            <span className="flex items-center gap-3">
                                                <span style={{ color: dummyTheme.icon }}>{item.icon}</span>
                                                <span className="font-medium">{item.name}</span>
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                menuOpen ? 'max-h-96 mt-2' : 'max-h-0'
                                            }`}
                                        >
                                            <ul className="space-y-1 pl-10">
                                                {item.children.map((child) => {
                                                    const childIsActive = isActivePath(child.path);
                                                    return (
                                                        <li key={child.id}>
                                                            <NavLink
                                                                to={child.path}
                                                                onClick={closeMobileSidebar}
                                                                className="block rounded-lg px-3 py-2 text-sm font-medium transition"
                                                                style={
                                                                    childIsActive
                                                                        ? {
                                                                              backgroundColor: dummyTheme.activeColor,
                                                                              color: dummyTheme.textColor,
                                                                          }
                                                                        : { color: dummyTheme.textColor }
                                                                }
                                                            >
                                                                {child.name}
                                                            </NavLink>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <NavLink
                                        to={item.path ?? '#'}
                                        onClick={closeMobileSidebar}
                                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition"
                                        style={
                                            itemIsActive
                                                ? {
                                                      backgroundColor: dummyTheme.activeColor,
                                                      color: dummyTheme.textColor,
                                                  }
                                                : { color: dummyTheme.textColor }
                                        }
                                    >
                                        <span style={{ color: dummyTheme.icon }}>{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </NavLink>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="border-t border-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={currentUser.image_url}
                            alt="User avatar"
                            className="h-11 w-11 rounded-full border border-white/10 object-cover"
                        />
                        <div>
                            <p className="font-semibold text-white">{currentUser.name}</p>
                            <p className="text-sm text-gray-400">{currentUser.position}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowLogoutButton((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-200 hover:bg-white/10"
                        aria-label="Open user actions"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>

                {showLogoutButton && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-3 w-full rounded-xl bg-red-500 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
