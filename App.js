import React, { useCallback, useState } from "react";

const PITCHING_DISTANCE_METERS = 18.44;

// FileUpload Component
const FileUpload = ({ onFileSelect }) => {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelect(file);
    } else {
      alert('動画ファイルを選択してください。');
    }
  };

  return React.createElement('div', { className: 'text-center space-y-4' },
    React.createElement('div', { className: 'border-2 border-dashed border-slate-600 rounded-xl p-8 transition-colors hover:border-cyan-400' },
      React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', { className: 'text-6xl' }, '📹'),
        React.createElement('h2', { className: 'text-xl font-semibold text-slate-200' }, '動画ファイルをアップロード'),
        React.createElement('p', { className: 'text-slate-400 text-sm' }, '動画ファイルを選択して速度測定を開始'),
        React.createElement('input', {
          type: 'file',
          accept: 'video/*',
          onChange: handleFileChange,
          className: 'block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer'
        })
      )
    )
  );
};

// VideoProcessor Component  
const VideoProcessor = ({ 
  videoFile, 
  startTime, 
  endTime, 
  distance, 
  onDistanceChange, 
  onStartTimeSet, 
  onEndTimeSet, 
  onCalculate, 
  onReset, 
  error 
}) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    if (videoFile && videoRef.current) {
      const url = URL.createObjectURL(videoFile);
      videoRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
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

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSetTime = (timeType) => {
    if (timeType === 'start') {
      onStartTimeSet(currentTime);
    } else {
      onEndTimeSet(currentTime);
    }
  };

  const formatTime = (time) => {
    return time ? time.toFixed(2) + 's' : '未設定';
  };

  return React.createElement('div', { className: 'space-y-4' },
    React.createElement('video', {
      ref: videoRef,
      className: 'w-full rounded-lg bg-black',
      controls: true,
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata
    }),
    
    React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
      React.createElement('div', { className: 'bg-slate-700 p-4 rounded-lg' },
        React.createElement('label', { className: 'block text-sm font-medium mb-2' }, '距離 (メートル)'),
        React.createElement('input', {
          type: 'number',
          step: '0.1',
          value: distance,
          onChange: (e) => onDistanceChange(Number(e.target.value)),
          className: 'w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white'
        })
      ),
      React.createElement('div', { className: 'bg-slate-700 p-4 rounded-lg' },
        React.createElement('p', { className: 'text-sm font-medium mb-2' }, '現在時刻: ' + currentTime.toFixed(2) + 's'),
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('button', {
            onClick: () => handleSetTime('start'),
            className: 'w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors'
          }, '開始点設定'),
          React.createElement('button', {
            onClick: () => handleSetTime('end'),
            className: 'w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors'
          }, '終了点設定')
        )
      )
    ),

    React.createElement('div', { className: 'bg-slate-700 p-4 rounded-lg' },
      React.createElement('div', { className: 'grid grid-cols-2 gap-4 mb-4' },
        React.createElement('div', null,
          React.createElement('span', { className: 'text-sm text-slate-400' }, '開始時刻: '),
          React.createElement('span', { className: 'font-mono' }, formatTime(startTime))
        ),
        React.createElement('div', null,
          React.createElement('span', { className: 'text-sm text-slate-400' }, '終了時刻: '),
          React.createElement('span', { className: 'font-mono' }, formatTime(endTime))
        )
      ),
      
      React.createElement('div', { className: 'flex gap-2' },
        React.createElement('button', {
          onClick: onCalculate,
          disabled: startTime === null || endTime === null,
          className: 'flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md font-medium transition-colors'
        }, '速度計算'),
        React.createElement('button', {
          onClick: onReset,
          className: 'px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md font-medium transition-colors'
        }, 'リセット')
      )
    ),

    error && React.createElement('div', { className: 'bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md' },
      error
    )
  );
};

// ResultDisplay Component
const ResultDisplay = ({ speed, onClose, onReset }) => {
  return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
    React.createElement('div', { className: 'bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-auto animate-fade-in' },
      React.createElement('div', { className: 'text-center space-y-4' },
        React.createElement('div', { className: 'text-6xl' }, '⚡'),
        React.createElement('h2', { className: 'text-2xl font-bold text-cyan-400' }, '計算結果'),
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('div', { className: 'bg-slate-700 p-4 rounded-lg' },
            React.createElement('div', { className: 'text-3xl font-bold text-white' }, speed.kmh.toFixed(1)),
            React.createElement('div', { className: 'text-slate-400' }, 'km/h')
          ),
          React.createElement('div', { className: 'bg-slate-700 p-4 rounded-lg' },
            React.createElement('div', { className: 'text-3xl font-bold text-white' }, speed.mph.toFixed(1)),
            React.createElement('div', { className: 'text-slate-400' }, 'mph')
          )
        ),
        React.createElement('div', { className: 'flex gap-2' },
          React.createElement('button', {
            onClick: onClose,
            className: 'flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md font-medium transition-colors'
          }, '閉じる'),
          React.createElement('button', {
            onClick: () => { onReset(); onClose(); },
            className: 'flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md font-medium transition-colors'
          }, '新しい測定')
        )
      )
    )
  );
};

// Main App Component
const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [calculatedSpeed, setCalculatedSpeed] = useState(null);
  const [distance, setDistance] = useState(PITCHING_DISTANCE_METERS);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
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
        setError("開始時刻と終了時刻は異なる必要があります。また、距離は0より大きい必要があります。");
      }
    } else {
      setError("有効な開始時刻と終了時刻を設定してください。終了時刻は開始時刻より後でなければなりません。");
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
      return React.createElement(VideoProcessor, {
        videoFile,
        startTime,
        endTime,
        distance,
        onDistanceChange: setDistance,
        onStartTimeSet: setStartTime,
        onEndTimeSet: setEndTime,
        onCalculate: handleCalculate,
        onReset: handleReset,
        error
      });
    }
    return React.createElement(FileUpload, { onFileSelect: handleFileSelect });
  };

  return React.createElement('div', { className: 'min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans' },
    React.createElement('div', { className: 'w-full max-w-md mx-auto' },
      React.createElement('header', { className: 'text-center mb-6' },
        React.createElement('h1', { className: 'text-3xl sm:text-4xl font-bold text-cyan-400 tracking-tight' }, 'スピードガン - 動画で速度測定'),
        React.createElement('p', { className: 'text-slate-400 mt-2' }, 'どんな動画からでもモノの速さを計算します。')
      ),
      React.createElement('main', { className: 'bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 transition-all duration-300' },
        renderContent()
      ),
      React.createElement('footer', { className: 'text-center mt-6 text-xs text-slate-500' },
        React.createElement('p', null, '距離を入力して、様々な速度を計算できます。')
      )
    ),
    calculatedSpeed && React.createElement(ResultDisplay, {
      speed: calculatedSpeed,
      onClose: handleCloseResultModal,
      onReset: handleReset
    })
  );
};

export default App;