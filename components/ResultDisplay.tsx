import React from "react";
import { BackIcon, RestartIcon } from "./icons";

interface ResultDisplayProps {
  speed: {
    kmh: number;
    mph: number;
  };
  onClose: () => void;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  speed,
  onClose,
  onReset,
}) => {
  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-300">
            計算された速度
          </h2>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-4xl font-bold text-cyan-400 tracking-tighter">
              {speed.mph.toFixed(1)}
            </p>
            <p className="text-sm text-slate-400">MPH</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-4xl font-bold text-cyan-400 tracking-tighter">
              {speed.kmh.toFixed(1)}
            </p>
            <p className="text-sm text-slate-400">KM/H</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center space-x-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            <BackIcon className="h-5 w-5" />
            <span>調整に戻る</span>
          </button>
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            <RestartIcon className="h-5 w-5" />
            <span>別の動画で測定</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
