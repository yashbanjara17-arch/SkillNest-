import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, Trash2, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface PhotoUploadProps {
  value?: string;
  onChange: (photoDataUrl: string) => void;
  label?: string;
  helperText?: string;
  fallbackInitials?: string;
  shape?: 'circle' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  allowUrlFallback?: boolean;
}

/**
 * Compresses and resizes an image file to a lightweight data URL (max 600x600, ~50-80KB).
 */
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image preview'));
      img.onload = () => {
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for solid images, PNG if transparency
        const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, 0.88);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value = '',
  onChange,
  label = 'Profile Photo',
  helperText = 'Upload a JPG, PNG, or WEBP photo. It will be automatically optimized.',
  fallbackInitials = 'SN',
  shape = 'rounded',
  size = 'md',
  allowUrlFallback = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
  }[size];

  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size is too large (must be under 10MB).');
      return;
    }

    try {
      setIsProcessing(true);
      const optimizedDataUrl = await processImageFile(file);
      onChange(optimizedDataUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not process this image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input value so re-uploading the same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange('');
    setErrorMessage(null);
    setUrlDraft('');
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="sn-label block">{label}</label>}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Photo Preview & Drop Trigger */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative group shrink-0 ${sizeClasses} ${radiusClass} border-2 overflow-hidden cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-102'
              : 'border-neutral-200 dark:border-neutral-700 hover:border-indigo-500/60 shadow-xs'
          } ${!value ? 'bg-indigo-50/70 dark:bg-indigo-950/40 flex items-center justify-center' : 'bg-neutral-100 dark:bg-neutral-800'}`}
          title="Click to select a photo from your computer or phone"
        >
          {value ? (
            <img
              src={value}
              alt={label}
              className={`w-full h-full object-cover ${radiusClass}`}
              onError={(e) => {
                // broken image fallback
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-indigo-600 dark:text-indigo-400">
              <Camera className="w-6 h-6 mb-1 opacity-80 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{fallbackInitials}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-neutral-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${radiusClass}`}
          >
            <Camera className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">{value ? 'Change' : 'Upload'}</span>
          </div>

          {/* Loading state */}
          {isProcessing && (
            <div className={`absolute inset-0 bg-neutral-900/70 text-white flex items-center justify-center text-xs font-semibold ${radiusClass}`}>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1" />
            </div>
          )}
        </div>

        {/* Action Buttons & Details */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={onFileInputChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{value ? 'Choose Another Photo' : 'Upload Photo'}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border sn-border-subtle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}

            {allowUrlFallback && !showUrlInput && (
              <button
                type="button"
                onClick={() => {
                  setUrlDraft(value.startsWith('http') ? value : '');
                  setShowUrlInput(true);
                }}
                className="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LinkIcon className="w-3 h-3" />
                <span>Paste link instead</span>
              </button>
            )}
          </div>

          {/* Optional Direct URL Input */}
          {showUrlInput && (
            <div className="flex items-center gap-2 pt-1 max-w-md">
              <input
                type="text"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="sn-input text-xs py-1.5 flex-1"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="px-2 py-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <p className="sn-helper text-[11px] leading-relaxed">
            {helperText}
          </p>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
