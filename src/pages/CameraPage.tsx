import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { ArrowLeft, Camera, Check, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { generateMockHand, calculateOkey101Score } from '../utils/okeyScoring';

interface ScanResult {
    id: string;
    image: string;
    predictedScore: number;
    breakdown: string[];
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

                // Generate mock hand and calculate real Okey 101 score
                const mockHand = generateMockHand();
                const scoringResult = calculateOkey101Score(mockHand);

                setResult({
                    id: uuidv4(),
                    image: imageSrc,
                    predictedScore: scoringResult.score,
                    breakdown: scoringResult.breakdown,
                    timestamp: Date.now()
                });
            }
            setScanning(false);
        }, 2000);
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
        <div className="h-full flex flex-col bg-slate-900">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                <button
                    onClick={() => navigate('/')}
                    className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors shadow-lg"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="px-4 py-2 bg-blue-600/90 backdrop-blur-md rounded-full text-white font-semibold text-sm shadow-lg">
                    Okey 101
                </div>
            </div>

            {/* Camera/Image Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[35%] border-2 border-white/60 rounded-2xl shadow-lg">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg"></div>
                        </div>
                        <p className="absolute bottom-28 left-0 right-0 text-center text-white font-semibold text-base bg-black/50 py-3 backdrop-blur-md">
                            📷 Istakanızı çerçeveye tam hizalayın
                        </p>
                    </div>
                )}

                {/* Scanning Animation */}
                {scanning && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
                        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-white font-bold text-xl animate-pulse">Hesaplanıyor...</p>
                        <p className="text-slate-400 text-sm mt-2">Okey 101 kurallarına göre</p>
                    </div>
                )}
            </div>

            {/* Bottom Controls / Results */}
            <div className="bg-slate-800 p-6 rounded-t-3xl z-20 shadow-2xl border-t border-slate-700">
                {!result ? (
                    <div className="flex justify-center">
                        <button
                            onClick={capture}
                            disabled={scanning}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 hover:scale-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/30"
                        >
                            <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
                                <Camera className="w-8 h-8 text-slate-900" />
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5 animate-fade-in-up">
                        {!feedbackMode ? (
                            <>
                                <div className="text-center bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-2xl border border-slate-600">
                                    <h3 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-2">Hesaplanan Puan</h3>
                                    <div className="text-6xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                                        {result.predictedScore}
                                    </div>
                                    <div className="text-left text-xs text-slate-400 space-y-1 max-h-32 overflow-y-auto bg-slate-900/50 p-3 rounded-lg">
                                        {result.breakdown.map((item, i) => (
                                            <div key={i}>• {item}</div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleFeedback(true)}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                                    >
                                        <Check className="w-5 h-5" />
                                        Doğru
                                    </button>
                                    <button
                                        onClick={() => handleFeedback(false)}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                                    >
                                        <X className="w-5 h-5" />
                                        Yanlış
                                    </button>
                                </div>

                                <button
                                    onClick={handleRetake}
                                    className="w-full py-3 text-slate-400 hover:text-white transition-colors font-semibold"
                                >
                                    Tekrar Dene
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center bg-slate-700 p-5 rounded-2xl">
                                    <h3 className="text-white font-bold text-lg mb-2">Doğru Puan Neydi?</h3>
                                    <p className="text-slate-400 text-sm">
                                        Yapay zekayı eğitmemize yardım edin
                                    </p>
                                </div>

                                <input
                                    type="number"
                                    value={correctScore}
                                    onChange={(e) => setCorrectScore(e.target.value)}
                                    placeholder="Gerçek Puanı Girin"
                                    className="w-full bg-slate-700 border-2 border-slate-600 text-white text-center text-3xl font-bold py-5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFeedbackMode(false)}
                                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-4 rounded-xl font-bold transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={submitCorrection}
                                        disabled={!correctScore}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
