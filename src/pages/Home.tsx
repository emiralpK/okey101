import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, Trophy, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col animate-fade-in">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-8">
                <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-300">
                        <Camera className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="space-y-4 max-w-xs mx-auto">
                    <h2 className="text-4xl font-black tracking-tight text-white">
                        Okey<span className="text-blue-500">Cam</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Yapay zeka ile elinizi saniyeler içinde hesaplayın.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/camera')}
                    className="group relative px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all active:translate-y-0 active:scale-95 w-full max-w-xs"
                >
                    <span className="flex items-center justify-center gap-3">
                        Taramayı Başlat
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="glass-panel p-4 hover:bg-white/15 transition-colors cursor-default group">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="font-bold text-white">101 Okey</div>
                    <div className="text-xs text-slate-400 mt-1">Otomatik Hesaplama</div>
                </div>

                <div className="glass-panel p-4 hover:bg-white/15 transition-colors cursor-default group">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="font-bold text-white">Hızlı Sonuç</div>
                    <div className="text-xs text-slate-400 mt-1">Anlık Görüntü İşleme</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
