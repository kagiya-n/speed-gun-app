import React, { useCallback, useState } from "react";
import FileUpload from "./components/FileUpload";
import ResultDisplay from "./components/ResultDisplay";
import VideoProcessor from "./components/VideoProcessor";
import { PITCHING_DISTANCE_METERS } from "./constants";

interface Speed {
  kmh: number;
  mph: number;
}

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [calculatedSpeed, setCalculatedSpeed] = useState<Speed | null>(null);
  const [distance, setDistance] = useState<number>(PITCHING_DISTANCE_METERS);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setStartTime(null);
    setEndTime(null);
    setCalculatedSpeed(null);
    setError(null);
    setDistance(PITCHING_DISTANCE_METERS);
  };

  const handleCalculate = useCallback(() => {
    setError(null);
    if (startTime !== null && endTime !== null && endTime > startTime) {
      const durationSeconds = endTime - startTime;
      if (durationSeconds > 0 && distance > 0) {
        const speedMps = distance / durationSeconds;
        const speedKmh = speedMps * 3.6;
        const speedMph = speedMps * 2.23694;
        setCalculatedSpeed({ kmh: speedKmh, mph: speedMph });
      } else {
        setError(
          "開始時刻と終了時刻は異なる必要があります。また、距離は0より大きい必要があります。"
        );
      }
    } else {
      setError(
        "有効な開始時刻と終了時刻を設定してください。終了時刻は開始時刻より後でなければなりません。"
      );
    }
  }, [startTime, endTime, distance]);

  const handleReset = () => {
    setVideoFile(null);
    setStartTime(null);
    setEndTime(null);
    setCalculatedSpeed(null);
    setError(null);
    setDistance(PITCHING_DISTANCE_METERS);
  };

  const handleCloseResultModal = () => {
    setCalculatedSpeed(null);
  };

  const renderContent = () => {
    if (videoFile) {
      return (
        <VideoProcessor
          videoFile={videoFile}
          startTime={startTime}
          endTime={endTime}
          distance={distance}
          onDistanceChange={setDistance}
          onStartTimeSet={setStartTime}
          onEndTimeSet={setEndTime}
          onCalculate={handleCalculate}
          onReset={handleReset}
          error={error}
        />
      );
    }
    return <FileUpload onFileSelect={handleFileSelect} />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-tight">
            スピードガン - 動画で速度測定
          </h1>
          <p className="text-slate-400 mt-2">
            どんな動画からでもモノの速さを計算します。
          </p>
        </header>
        <main className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 transition-all duration-300">
          {renderContent()}
        </main>
        <footer className="text-center mt-6 text-xs text-slate-500">
          <p>距離を入力して、様々な速度を計算できます。</p>
        </footer>
      </div>
      {calculatedSpeed && (
        <ResultDisplay
          speed={calculatedSpeed}
          onClose={handleCloseResultModal}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
