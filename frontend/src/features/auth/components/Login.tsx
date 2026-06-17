import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../../api/axios.config';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 2FA States
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [tempUserId, setTempUserId] = useState('');

  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const setUser = useAppStore((state) => state.setUser);
  const setIsAddingAccount = useAppStore((state) => state.setIsAddingAccount);
  const isAddingAccount = useAppStore((state) => state.isAddingAccount);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/v1/users/google-auth', {
        idToken: credentialResponse.credential
      });
      const result = response.data;

      if (result.success) {
        toast.success("Welcome back!");
        setUser(result.data.user, result.data.accessToken, result.data.refreshToken);
        
        if (isAddingAccount) {
          setIsAddingAccount(false);
          navigate('/');
        } else {
          setAuth(true);
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requires2FA) {
      if (!twoFactorToken || twoFactorToken.length !== 6) {
        toast.error("Please enter a valid 6-digit 2FA code");
        return;
      }
      setIsLoading(true);
      try {
        const response = await api.post('/api/v1/users/verify-2fa-login', {
          userId: tempUserId,
          token: twoFactorToken
        });
        const result = response.data;
        if (result.success) {
          toast.success("Welcome back!");
          setUser(result.data.user, result.data.accessToken, result.data.refreshToken);
          if (isAddingAccount) {
            setIsAddingAccount(false);
            navigate('/');
          } else {
            setAuth(true);
            navigate('/');
          }
        }
      } catch (error) {
        console.error("2FA Error:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Normal Login Validation
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.username.trim()) newErrors.username = true;
    if (!formData.password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 500);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/v1/users/login', formData);
      const result = response.data;

      if (result.success) {
        if (result.data.requires2FA) {
          setRequires2FA(true);
          setTempUserId(result.data.userId);
          toast("Two-Factor Authentication required", { icon: "🔒" });
        } else {
          toast.success("Welcome back!");
          setUser(result.data.user, result.data.accessToken, result.data.refreshToken);
          
          if (isAddingAccount) {
            setIsAddingAccount(false);
            navigate('/');
          } else {
            setAuth(true);
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);
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

      <div className="w-full max-w-md md:max-w-4xl bg-slate-950/60 backdrop-blur-3xl border border-slate-900 p-8 md:p-12 rounded-[40px] md:rounded-[56px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Branding (Logo & Title) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-accent/10 rounded-[24px] md:rounded-[32px] mb-4 md:mb-6 border border-accent/20 overflow-hidden">
              {requires2FA ? (
                <i className="fi fi-rr-shield-check text-3xl md:text-4xl text-accent"></i>
              ) : (
                <img src="/JanNetra.png" alt="JanNetra Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              {requires2FA ? "Security" : "JanNetra"}
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 md:mt-3">
              {requires2FA ? "Enter 2FA Code" : "Welcome Back, Citizen"}
            </p>
            
            <p className="hidden md:block text-slate-400 text-xs mt-6 leading-relaxed max-w-xs font-medium">
              Access the India Social Directory. Connect with your community, monitor schemes, and share your voice securely.
            </p>
          </div>

          {/* Right Column: Login Form */}
          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
              {!requires2FA ? (
                <>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 px-1">Username / Mobile</label>
                    <input 
                      type="text" 
                      placeholder="rahul_01"
                      className={`w-full bg-slate-900/50 border ${errors.username ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[20px] px-5 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 px-1">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        className={`w-full bg-slate-900/50 border ${errors.password ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[20px] px-5 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'} flex items-center`}></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-in slide-in-from-right duration-300">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 px-1 text-center">Google Authenticator Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="000000"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-[20px] px-5 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-center text-xl tracking-[0.5em] font-black"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-2 text-xs"
              >
                {isLoading ? 'Authenticating...' : (requires2FA ? 'Verify 2FA' : 'Secure Login')}
              </button>

              {!requires2FA && (
                <div className="text-center">
                  <Link to="/forgot-password" className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-accent transition-colors">Forgot Password?</Link>
                </div>
              )}
            </form>

            {!requires2FA && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-slate-900"></div>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-slate-900"></div>
                </div>
                
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      toast.error('Google Login Failed');
                    }}
                    theme="filled_black"
                    shape="pill"
                  />
                </div>
              </>
            )}

            {!requires2FA && (
              <div className="mt-8 text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  New to JanNetra? <Link to="/signup" className="text-accent hover:underline">Apply for ID</Link>
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
