'use client';
// src/components/BannerImageUploader.tsx

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Link as LinkIcon, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface BannerImageUploaderProps {
  currentUrl: string;
  onUpload: (url: string) => void;
}

const BannerImageUploader = ({ currentUrl, onUpload }: BannerImageUploaderProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [dragOver, setDragOver] = useState(false);

  // ── Handle file upload to /api/upload ─────────────────────────────────────
  const handleFile = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, GIF allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Upload failed');

      onUpload(data.url);
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSave = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    onUpload(urlInput.trim());
    toast.success('Image URL set!');
  };

  return (
    <div className="space-y-3">
      {/* ── Current image preview ── */}
      {currentUrl && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <Image src={currentUrl} fill alt="banner preview" className="object-cover" />
          <button
            onClick={() => onUpload('')}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Tab switcher ── */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        <button
          onClick={() => setTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-all ${tab === 'upload' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
        <button
          onClick={() => setTab('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-all ${tab === 'url' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Paste URL
        </button>
      </div>

      {/* ── Upload tab ── */}
      {tab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/30'
          } ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileInput}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">
                Drag & drop or <span className="text-green-600 underline">browse</span>
              </p>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF — max 5MB</p>
            </>
          )}
        </div>
      )}

      {/* ── URL tab ── */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none bg-gray-50"
          />
          <button
            onClick={handleUrlSave}
            className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-all"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerImageUploader;