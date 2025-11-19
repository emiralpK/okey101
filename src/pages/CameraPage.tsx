import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { ArrowLeft, Camera, Check, X, Save, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface ScanResult {
    id: string;
    image: string;
    predictedScore: number;
    timestamp: number;
}

const CameraPage: React.FC = () => {
    const navigate = useNavigate();
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [correctScore, setCorrectScore] = useState('');

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "environment"
    };

    const capture = useCallback(() => {
        setScanning(true);
        // Simulate processing time
        setTimeout(() => {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                setImgSrc(imageSrc);
                // Mock prediction result
                setResult({
                    id: uuidv4(),
                    image: imageSrc,
                    predictedScore: Math.floor(Math.random() * 100) + 100, // Random score 100-200
                    timestamp: Date.now()
                });
            }
            setScanning(false);
        }, 1500);
    }, [webcamRef]);

    const handleRetake = () => {
        setImgSrc(null);
        setResult(null);
        setFeedbackMode(false);
        setCorrectScore('');
    };

    const handleFeedback = (isCorrect: boolean) => {
        if (isCorrect) {
            alert("Geri bildiriminiz için teşekkürler! Bu veri yapay zekayı geliştirmek için kullanılacak.");
            handleRetake();
        } else {
            setFeedbackMode(true);
        }
    };

    const submitCorrection = () => {
        if (!result) return;

        const feedbackData = {
            ...result,
            userCorrection: parseInt(correctScore),
            isCorrect: false
        };

        // In a real app, this would send data to a server
        console.log("Feedback collected:", feedbackData);

        // Create a downloadable JSON for the user (simulating data collection)
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbackData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "okey_training_data_" + result.id + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        alert("Düzeltme kaydedildi ve eğitim verisi olarak indirildi! Teşekkürler.");
        handleRetake();
    };

    return (
        <div className="h-full flex flex-col bg-black">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Camera/Image Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {imgSrc ? (
                    <img src={imgSrc} alt="Captured" className="w-full h-full object-contain" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="absolute inset-0 w-full h-full object-cover"
                        onUserMediaError={(e) => console.error("Camera error:", e)}
                    />
                )}

                {/* Scanning Overlay */}
                {!imgSrc && !scanning && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] border-2 border-white/50 rounded-lg">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
                        </div>
                        <p className="absolute bottom-24 left-0 right-0 text-center text-white/80 text-sm font-medium bg-black/40 py-2 backdrop-blur-sm">
                            Istakanızı çerçeveye hizalayın
                        </p>
                    </div>
                )}

                {/* Scanning Animation */}
                {scanning && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-bold text-lg animate-pulse">Hesaplanıyor...</p>
                    </div>
                )}
            </div>

            {/* Bottom Controls / Results */}
            <div className="bg-slate-900 p-6 rounded-t-3xl z-20">
                {!result ? (
                    <div className="flex justify-center">
                        <button
                            onClick={capture}
                            disabled={scanning}
                            className="w-20 h-20 rounded-full border-4 border-white/20 p-1 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
                                <Camera className="w-8 h-8 text-slate-900" />
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in-up">
                        {!feedbackMode ? (
                            <>
                                <div className="text-center">
                                    <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Hesaplanan Puan</h3>
                                    <div className="text-5xl font-black text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                        {result.predictedScore}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleFeedback(true)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Check className="w-5 h-5" />
                                        Doğru
                                    </button>
                                    <button
                                        onClick={() => handleFeedback(false)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                        Yanlış
                                    </button>
                                </div>

                                <button
                                    onClick={handleRetake}
                                    className="w-full py-3 text-slate-400 hover:text-white transition-colors"
                                >
                                    Tekrar Dene
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-white font-bold text-lg mb-2">Doğrusu neydi?</h3>
                                    <p className="text-slate-400 text-sm">
                                        Yapay zekayı geliştirmemize yardım et.
                                    </p>
                                </div>

                                <input
                                    type="number"
                                    value={correctScore}
                                    onChange={(e) => setCorrectScore(e.target.value)}
                                    placeholder="Gerçek Puanı Girin"
                                    className="w-full bg-slate-800 border border-slate-700 text-white text-center text-2xl font-bold py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFeedbackMode(false)}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={submitCorrection}
                                        disabled={!correctScore}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-5 h-5" />
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraPage;
