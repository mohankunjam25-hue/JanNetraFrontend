import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createReportApi } from '../../api/report.api';

interface ReportModalProps {
  itemId: string;
  itemType: 'Post' | 'Comment' | 'User';
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ itemId, itemType, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    "Spam",
    "Hate Speech",
    "Harassment",
    "False Information",
    "Inappropriate Content",
    "Violence",
    "Self-harm",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return toast.error("Please select a reason");

    setIsSubmitting(true);
    try {
      const res = await createReportApi(itemId, itemType, reason, description);
      if (res.success) {
        toast.success("Report submitted successfully");
        onClose();
      } else {
        toast.error(res.message || "Failed to submit report");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Report {itemType}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fi fi-rr-cross-small text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Reason for Reporting</label>
            <div className="grid grid-cols-2 gap-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    reason === r 
                      ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Additional Details (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-red-500 outline-none transition-all h-32 resize-none"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
