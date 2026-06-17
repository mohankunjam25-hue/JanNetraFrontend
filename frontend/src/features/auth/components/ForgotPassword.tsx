import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPasswordApi, resetPasswordApi } from '../../../api/user.api';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrors({ email: true });
      setTimeout(() => setErrors({}), 500);
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPasswordApi(email);
      if (result.success) {
        setStep('otp');
      } else {
        alert(result.message || "Email not found");
      }
    } catch (error) {
      alert("Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6 || newPassword.length < 6) {
      setErrors({ otp: otp.length < 6, newPassword: newPassword.length < 6 });
      setTimeout(() => setErrors({}), 500);
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordApi({ email, otp, newPassword });
      if (result.success) {
        setStep('success');
      } else {
        alert(result.message || "Invalid OTP");
      }
    } catch (error) {
      alert("Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#08060d] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-950/60 backdrop-blur-3xl border border-slate-900 p-10 md:p-14 rounded-[56px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-3xl mb-6 border border-accent/20">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Reset ID</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">JanNetra Security</p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleRequestOTP} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Registered Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                className={`w-full bg-slate-900/50 border ${errors.email ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none transition-all shadow-inner`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-[9px] text-slate-500 mt-3 px-1">We will send a 6-digit OTP to this email if it exists.</p>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-5 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {isLoading ? 'Sending OTP...' : 'Get OTP'}
            </button>
            <div className="text-center pt-2">
               <Link to="/login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Back to Login</Link>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleResetPassword} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">6-Digit OTP</label>
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000"
                className={`w-full bg-slate-900/50 border ${errors.otp ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none text-center text-2xl tracking-[0.5em] font-black shadow-inner`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className={`w-full bg-slate-900/50 border ${errors.newPassword ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none transition-all shadow-inner`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-5 bg-gradient-to-r from-accent to-purple-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {isLoading ? 'Resetting...' : 'Update Password'}
            </button>
            <div className="text-center pt-2">
               <button type="button" onClick={() => setStep('email')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Change Email</button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
               <i className="fi fi-rr-check text-4xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Success!</h3>
              <p className="text-slate-500 text-xs mt-2 font-medium">Your password has been updated securely.</p>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-5 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
