import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="p-4 glass-panel m-4 mb-0 flex justify-between items-center sticky top-4 z-50">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    OkeyCam
                </h1>
                <nav>
                    {/* Navigation items can go here */}
                </nav>
            </header>

            <main className="flex-1 p-4 overflow-hidden relative">
                <Outlet />
            </main>

            <footer className="p-4 text-center text-slate-500 text-sm">
                © 2024 OkeyCam El Hesaplayıcı
            </footer>
        </div>
    );
};

export default Layout;
