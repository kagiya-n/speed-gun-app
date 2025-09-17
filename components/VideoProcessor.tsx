import React, { useEffect, useRef, useState } from "react";
import {
  FrameBackIcon,
  FrameForwardIcon,
  PauseIcon,
  PlayIcon,
  TimerIcon,
} from "./icons";

interface VideoProcessorProps {
  videoFile: File;
  startTime: number | null;
  endTime: number | null;
  distance: number;
  onDistanceChange: (distance: number) => void;
  onStartTimeSet: (time: number) => void;
  onEndTimeSet: (time: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  error: string | null;
}

const VideoProcessor: React.FC<VideoProcessorProps> = ({
  videoFile,
  startTime,
  endTime,
  distance,
  onDistanceChange,
  onStartTimeSet,
  onEndTimeSet,
  onCalculate,
  onReset,
  error,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const FRAME_STEP = 1 / 60; // 60fpsを想定して細かく調整

  useEffect(() => {
    const url = URL.createObjectURL(videoFile);
    setVideoSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFrameStep = (direction: "forward" | "backward") => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      const newTime =
        videoRef.current.currentTime +
        (direction === "forward" ? FRAME_STEP : -FRAME_STEP);
      videoRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(event.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number | null) => {
    if (time === null || isNaN(time)) return "0.000s";
    return time.toFixed(3) + "s";
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          playsInline // iOSでインライン再生を有効化
        ></video>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFrameStep("backward")}
            className="p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition"
            aria-label="1フレーム戻る"
          >
            <FrameBackIcon className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition"
            aria-label={isPlaying ? "一時停止" : "再生"}
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={() => handleFrameStep("forward")}
            className="p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition"
            aria-label="1フレーム進む"
          >
            <FrameForwardIcon className="h-5 w-5" />
          </button>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.001"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-xs font-mono w-16 text-right">
            {formatTime(duration)}
          </span>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="distance-input"
            className="text-sm font-medium text-slate-400"
          >
            距離 (m)
          </label>
          <input
            id="distance-input"
            type="number"
            value={distance}
            onChange={(e) => onDistanceChange(parseFloat(e.target.value) || 0)}
            step="0.01"
            placeholder="例: 18.44"
            className="w-full bg-slate-700 border border-slate-600 text-white text-center font-mono py-2 px-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-sm text-slate-400">開始時間</p>
            <p className="font-mono text-lg font-semibold text-cyan-400">
              {formatTime(startTime)}
            </p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-sm text-slate-400">終了時間</p>
            <p className="font-mono text-lg font-semibold text-cyan-400">
              {formatTime(endTime)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              videoRef.current && onStartTimeSet(videoRef.current.currentTime)
            }
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            開始点をマーク
          </button>
          <button
            onClick={() =>
              videoRef.current && onEndTimeSet(videoRef.current.currentTime)
            }
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            終了点をマーク
          </button>
        </div>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <button
          onClick={onCalculate}
          disabled={startTime === null || endTime === null || distance <= 0}
          className="w-full flex items-center justify-center space-x-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <TimerIcon className="h-6 w-6" />
          <span>速度を計算</span>
        </button>
        <button
          onClick={onReset}
          className="w-full text-sm text-slate-400 hover:text-slate-200 transition text-center mt-2"
        >
          別の動画を選択
        </button>
      </div>
    </div>
  );
};

export default VideoProcessor;
