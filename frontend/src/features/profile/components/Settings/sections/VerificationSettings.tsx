import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { submitVerificationApi } from '../../../../../api/user.api';

const VerificationSettings: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return toast.error("Please upload an ID document");

        const formData = new FormData();
        formData.append("idDocument", file);

        setIsSubmitting(true);
        try {
            const res = await submitVerificationApi(formData);
            if (res.success) {
                toast.success("Verification request submitted successfully. We will review it shortly.");
                setFile(null);
            } else {
                toast.error(res.message || "Failed to submit request");
            }
        } catch (error) {
            toast.error("An error occurred during submission");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                        <i className="fi fi-sr-badge-check text-blue-500 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest italic">Identity Verification</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Get the blue badge of trust</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Verification on JanNetra helps citizens identify authentic voices in governance and administration. To qualify, you must upload a government-issued identity document (Aadhar, PAN, Voter ID, etc.).
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                            <i className="fi fi-rr-check-circle text-accent"></i>
                            Increases visibility in Analytics
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                            <i className="fi fi-rr-check-circle text-accent"></i>
                            Priority support for administrative issues
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                            <i className="fi fi-rr-check-circle text-accent"></i>
                            Badge displayed on your profile and posts
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <div className={`w-full aspect-video rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer ${file ? 'border-accent bg-accent/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'}`}>
                            <input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <>
                                    <i className="fi fi-rr-document text-4xl text-accent mb-4"></i>
                                    <p className="text-sm font-black text-white truncate max-w-full px-4">{file.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black mt-2">Click to replace document</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <i className="fi fi-rr-upload text-2xl text-slate-500"></i>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Upload ID Document</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Supported formats: JPG, PNG, PDF</p>
                                </>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting || !file}
                        className="w-full py-4 bg-accent hover:bg-purple-600 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-accent/20"
                    >
                        {isSubmitting ? 'Submitting Request...' : 'Request Verification'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationSettings;
