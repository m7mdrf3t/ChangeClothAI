import React, { useCallback, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageUploadState } from '../types';

interface ImageUploadProps {
  title: string;
  description: string;
  value: ImageUploadState;
  onChange: (value: ImageUploadState) => void;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  description,
  value,
  onChange,
  accept = 'image/*'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          file,
          preview: e.target?.result as string,
          isDragging: false
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onChange({ ...value, isDragging: true });
  }, [value, onChange]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onChange({ ...value, isDragging: false });
  }, [value, onChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    onChange({ file: null, preview: null, isDragging: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="input-group">
      <label>{title}</label>
      <div
        className={`file-upload ${value.isDragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        {value.preview ? (
          <div style={{ position: 'relative' }}>
            <img
              src={value.preview}
              alt="Preview"
              className="image-preview"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <Upload size={48} style={{ marginBottom: '16px', opacity: 0.6 }} />
            <p style={{ marginBottom: '8px', fontWeight: 600 }}>{description}</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Click to upload or drag and drop
            </p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              Supports JPG, PNG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
