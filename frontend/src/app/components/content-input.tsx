import { useState } from 'react';
import { FileText, Image, Video, Search, RotateCcw, Upload, X } from 'lucide-react';
import type { ContentType } from '../App';

interface ContentInputProps {
  onAnalyze: (content: string | File, type: ContentType) => void;
  isAnalyzing: boolean;
  onReset: () => void;
  hasResult: boolean;
}

export function ContentInput({ onAnalyze, isAnalyzing, onReset, hasResult }: ContentInputProps) {
  const [selectedType, setSelectedType] = useState<ContentType>('text');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleSubmit = () => {
    if (selectedType === 'text' && textContent.trim()) {
      onAnalyze(textContent, 'text');
    } else if ((selectedType === 'image' || selectedType === 'video') && uploadedFile) {
      onAnalyze(uploadedFile, selectedType);
    }
  };

  const handleReset = () => {
    setTextContent('');
    setUploadedFile(null);
    setPreviewUrl('');
    onReset();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const canAnalyze = 
    (selectedType === 'text' && textContent.trim()) || 
    ((selectedType === 'image' || selectedType === 'video') && uploadedFile);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Multi-Modal Analysis</h2>
        <p className="text-sm text-gray-500 mt-1">
          Analyze text, images, or videos for misinformation and manipulation
        </p>
      </div>

      {/* Content Type Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedType('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-colors ${
            selectedType === 'text'
              ? 'bg-blue-50 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          disabled={isAnalyzing}
        >
          <FileText className="size-4" />
          <span className="text-sm font-medium">Text</span>
        </button>
        <button
          onClick={() => setSelectedType('image')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-colors ${
            selectedType === 'image'
              ? 'bg-blue-50 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          disabled={isAnalyzing}
        >
          <Image className="size-4" />
          <span className="text-sm font-medium">Image</span>
        </button>
        <button
          onClick={() => setSelectedType('video')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-colors ${
            selectedType === 'video'
              ? 'bg-blue-50 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          disabled={isAnalyzing}
        >
          <Video className="size-4" />
          <span className="text-sm font-medium">Video</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
        {selectedType === 'text' ? (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste news article, social media post, or any text content..."
            className="flex-1 p-6 text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none"
            disabled={isAnalyzing}
          />
        ) : (
          <div className="flex-1 p-6">
            {!uploadedFile ? (
              <label className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                <Upload className="size-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload {selectedType}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedType === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 50MB'}
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept={selectedType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  disabled={isAnalyzing}
                />
              </label>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">{uploadedFile.name}</span>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={isAnalyzing}
                  >
                    <X className="size-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedType === 'image' && previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  )}
                  {selectedType === 'video' && previewUrl && (
                    <video src={previewUrl} controls className="w-full h-full" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!canAnalyze || isAnalyzing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Search className="size-5" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
        </button>
        
        {hasResult && (
          <button
            onClick={handleReset}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="size-5" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 text-xs text-gray-500">
        {selectedType === 'text' && 'Analyzes claims, sources, and linguistic patterns'}
        {selectedType === 'image' && 'Detects AI-generated images and photo manipulation'}
        {selectedType === 'video' && 'Identifies deepfakes and video manipulation'}
      </div>
    </div>
  );
}
