'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, FileSpreadsheet, Paperclip } from 'lucide-react';

export interface AttachmentPayload {
  fileName: string;
  fileSize: number;
  mimeType: string;
  dataBase64?: string;
}

interface FileUploadZoneProps {
  onFilesChange: (files: AttachmentPayload[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function FileUploadZone({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<AttachmentPayload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = (fileList: FileList) => {
    setError(null);
    if (files.length + fileList.length > maxFiles) {
      setError(`You can attach a maximum of ${maxFiles} supporting files.`);
      return;
    }

    const newFiles: AttachmentPayload[] = [];
    Array.from(fileList).forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const payload: AttachmentPayload = {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream',
          dataBase64: reader.result as string,
        };
        newFiles.push(payload);

        if (newFiles.length === fileList.length) {
          const updated = [...files, ...newFiles];
          setFiles(updated);
          onFilesChange(updated);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-sky-400" />;
    if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    return <FileText className="w-5 h-5 text-indigo-400" />;
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          isDragging
            ? 'border-sky-400 bg-sky-950/30'
            : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFileList(e.target.files);
          }}
        />

        <div className="p-3 rounded-full bg-slate-800 text-sky-400 mb-2">
          <Upload className="w-5 h-5" />
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-200 text-center">
          Click or drag & drop supporting evidence
        </p>
        <p className="text-[11px] text-slate-400 text-center mt-1">
          PDF, Images, Word documents, Excel sheets, event photos (up to {maxSizeMB}MB each)
        </p>
        <span className="mt-2 text-[10px] text-sky-400/80 font-medium">
          Automatically archived into Administrator&apos;s Google Drive
        </span>
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getFileIcon(file.mimeType)}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate max-w-[170px]">
                    {file.fileName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
