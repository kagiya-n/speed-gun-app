import React, { useRef } from "react";
import { CameraIcon, UploadIcon } from "./icons";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center">
        <p className="text-slate-400">分析したい投球の動画を選んでください。</p>
      </div>

      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-full space-y-4">
        <button
          onClick={triggerFileInput}
          className="w-full flex items-center justify-center space-x-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <UploadIcon className="h-6 w-6" />
          <span>ギャラリーから選択</span>
        </button>

        <button
          onClick={triggerFileInput}
          className="w-full flex items-center justify-center space-x-3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <CameraIcon className="h-6 w-6" />
          <span>ビデオを録画</span>
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
