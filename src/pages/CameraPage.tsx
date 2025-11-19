import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CameraPage: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        setLoading(true);
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Kameraya erişilemedi. Lütfen izinleri kontrol edin veya HTTPS bağlantısı kullandığınızdan emin olun.");
        } finally {
            setLoading(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            setStream(null);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={startCamera}
                        className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
                    >
                        <RefreshCw className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Camera Viewport */}
            <div className="flex-1 relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-blue-400 animate-pulse">Kamera Başlatılıyor...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900 p-6 text-center">
                        <div className="max-w-xs">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Camera className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Kamera Hatası</h3>
                            <p className="text-slate-400 mb-6">{error}</p>
                            <button
                                onClick={startCamera}
                                className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    </div>
                )}

                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    autoPlay
                    muted
                />

                {/* Scanning Overlay */}
                {!loading && !error && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-[20px] border-black/50 clip-path-scan"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[30%] border-2 border-white/50 rounded-lg">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>

                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-scan"></div>
                        </div>
                        <p className="absolute bottom-8 left-0 right-0 text-center text-white/80 text-sm font-medium bg-black/40 py-2 backdrop-blur-sm">
                            Istakanızı çerçevenin içine hizalayın
                        </p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-6 mb-2 flex justify-center">
                <button className="w-20 h-20 rounded-full border-4 border-white/20 p-1 hover:scale-105 transition-transform active:scale-95">
                    <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-900" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default CameraPage;
