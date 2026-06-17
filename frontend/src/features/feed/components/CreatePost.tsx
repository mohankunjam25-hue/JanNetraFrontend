import React, { useState, useRef } from 'react';
import { useAppStore } from '../../../store/appStore';
import { createPostApi } from '../../../api/post.api';
import toast from 'react-hot-toast';

interface CreatePostProps {
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [media, setMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = useAppStore((state) => state.user);
  const addPost = useAppStore((state) => state.addPost);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setMedia((prev) => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;

    setIsLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('content', content);
    media.forEach((file) => {
      formData.append('media', file);
    });

    try {
      const result = await createPostApi(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      if (result.success) {
        toast.success("Post published!");
        addPost(result.data);
        onClose();
      }
    } catch (error) {
      console.error("Create Post Error:", error);
      // Toast error is already handled by axios interceptor
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        {isLoading && (
          <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full">
            <div 
              className="h-full bg-accent transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Create New Update</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fi fi-rr-cross-small text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening in your area?"
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-500 resize-none outline-none py-2 text-lg font-medium"
                rows={4}
              ></textarea>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fi fi-rr-cross-small text-xl"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleMediaChange} 
                className="hidden" 
                multiple 
                accept="image/*,video/*" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
              >
                <i className="fi fi-rr-picture text-xl"></i>
              </button>
              <button 
                type="button"
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <i className="fi fi-rr-marker text-xl"></i>
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading || (!content.trim() && media.length === 0)}
              className="bg-accent text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? 'Posting...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
