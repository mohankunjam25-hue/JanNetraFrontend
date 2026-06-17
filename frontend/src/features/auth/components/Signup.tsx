import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { GeographyService } from '../../../services/geographyService';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../../api/axios.config';
import toast from 'react-hot-toast';
import type { StateData, DistrictData, BlockData } from '../../../services/geographyService';

type SignupStep = 'identity' | 'location' | 'interests';

interface SignupFormData {
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  stateId: string;
  stateName: string;
  districtId: string;
  districtName: string;
  blockId: string;
  blockName: string;
  village: string;
  interests: string[];
}

const Signup: React.FC = () => {
  const [step, setStep] = useState<SignupStep>('identity');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const setUser = useAppStore((state) => state.setUser);
  const updateLocation = useAppStore((state) => state.updateLocation);

  const [states, setStates] = useState<StateData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    stateId: '',
    stateName: '',
    districtId: '',
    districtName: '',
    blockId: '',
    blockName: '',
    village: '',
    interests: []
  });

  useEffect(() => {
    GeographyService.getStates().then(setStates);
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      GeographyService.getDistricts(formData.stateId).then(setDistricts);
    }
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.districtId) {
      GeographyService.getBlocks(formData.districtId).then(setBlocks);
    }
  }, [formData.districtId]);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = () => {
    const newErrors: { [key: string]: boolean } = {};
    
    if (step === 'identity') {
      // Full Name: At least 2 words
      const nameParts = formData.fullName.trim().split(/\s+/);
      if (nameParts.length < 2) newErrors.fullName = true;
      
      // Username Rules
      const usernameTrimmed = formData.username.trim().toLowerCase();
      const usernameRegex = /^[a-z0-9._]{6,15}$/;
      const isNumeric = /^\d+$/.test(usernameTrimmed);
      const hasGeneric = ['admin', 'test', 'system', 'root', 'jannetra'].some(w => usernameTrimmed.includes(w));
      
      if (!usernameRegex.test(usernameTrimmed) || isNumeric || hasGeneric) {
        newErrors.username = true;
        if (!toast.custom) toast.error("Username: 6-15 chars, no spaces/specials, no generic words.");
      }

      // Email: Valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = true;
      
      if (!formData.mobile || formData.mobile.length < 10) newErrors.mobile = true;
      
      // Relaxed Password Rules for Testing
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = true;
        toast.error("Password must be at least 6 characters.");
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 500);
      return false;
    }
    return true;
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/v1/users/google-auth', {
        idToken: credentialResponse.credential
      });
      const result = response.data;

      if (result.success) {
        toast.success("Account setup successful!");
        setUser(result.data.user, result.data.accessToken, result.data.refreshToken);
        
        // Since Google Login bypasses the location/interest step initially, 
        // we send them to the homepage where they can update their profile later.
        setAuth(true);
        navigate('/');
      }
    } catch (error: any) {
      console.error("Google Signup Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step === 'identity') setStep('location');
    else if (step === 'location') setStep('interests');
    else {
      setIsLoading(true);
      try {
        const response = await api.post('/api/v1/users/register', {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          state: formData.stateName,
          district: formData.districtName,
          block: formData.blockName,
          village: formData.village,
          interests: formData.interests
        });
        
        const result = response.data;

        if (result.success) {
          toast.success("Account created successfully!");
          
          // Updated: Pass tokens to setUser
          setUser(result.data.user, result.data.accessToken, result.data.refreshToken);

          updateLocation({ 
            state: formData.stateName, 
            district: formData.districtName, 
            block: formData.blockName,
            village: formData.village 
          });

          // FINAL STEP: Navigate to home page
          navigate('/');
        }
      } catch (error: any) {
        console.error("Signup Error:", error);
        // Global axios interceptor handles toasts
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderIdentity = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 overflow-y-auto max-h-[60vh] pr-2 scrollbar-none">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Identity</h2>
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Personal Credentials</p>
      </div>

      <div className="flex justify-center mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google Sign Up Failed')}
          theme="filled_black"
          shape="pill"
          text="continue_with"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-slate-800"></div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">OR</span>
        <div className="flex-1 h-px bg-slate-800"></div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Full Name (Min 2 words)</label>
          <input 
            type="text" 
            placeholder="Rahul Sharma"
            className={`w-full bg-slate-900/50 border ${errors.fullName ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Username (lowercase, numbers, _)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
            <input 
              type="text" 
              placeholder="rahul_01"
              className={`w-full bg-slate-900/50 border ${errors.username ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] pl-12 pr-6 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
          <input 
            type="email" 
            placeholder="rahul@example.com"
            className={`w-full bg-slate-900/50 border ${errors.email ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value.toLowerCase()})}
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Mobile Number</label>
          <input 
            type="tel" 
            placeholder="+91"
            className={`w-full bg-slate-900/50 border ${errors.mobile ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              className={`w-full bg-slate-900/50 border ${errors.password ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-[24px] px-6 py-4 text-white focus:border-accent outline-none transition-all shadow-inner text-sm`}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'} flex items-center`}></i>
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-full py-5 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all mt-8"
      >
        Continue <i className="fi fi-rr-arrow-right ml-2 inline-flex items-center"></i>
      </button>

      <div className="text-center mt-6">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          Already have an account? <span onClick={() => navigate('/login')} className="text-accent cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Governance</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Administrative Area</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Select State</label>
          <select 
            className="w-full bg-slate-900 border border-slate-800 rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none appearance-none cursor-pointer"
            value={formData.stateId}
            onChange={(e) => {
              const name = states.find(s => s.id === e.target.value)?.name || '';
              setFormData({...formData, stateId: e.target.value, stateName: name, districtId: '', districtName: '', blockId: '', blockName: ''});
              if (!e.target.value) setDistricts([]);
            }}
          >
            <option value="">Choose State</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Select District</label>
          <select 
            className="w-full bg-slate-900 border border-slate-800 rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none appearance-none cursor-pointer disabled:opacity-30"
            disabled={!formData.stateId || isLoading}
            value={formData.districtId}
            onChange={(e) => {
              const name = districts.find(d => d.id === e.target.value)?.name || '';
              setFormData({...formData, districtId: e.target.value, districtName: name, blockId: '', blockName: ''});
            }}
          >
            <option value="">Choose District</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Select Block</label>
          <select 
            className="w-full bg-slate-900 border border-slate-800 rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none appearance-none cursor-pointer disabled:opacity-30"
            disabled={!formData.districtId || isLoading}
            value={formData.blockId}
            onChange={(e) => {
              const name = blocks.find(b => b.id === e.target.value)?.name || '';
              setFormData({...formData, blockId: e.target.value, blockName: name});
            }}
          >
            <option value="">Choose Block</option>
            {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Village / Ward</label>
          <input 
            type="text" 
            placeholder="e.g. Arera Colony"
            className="w-full bg-slate-900 border border-slate-800 rounded-[24px] px-6 py-5 text-white focus:border-accent outline-none transition-all"
            value={formData.village}
            onChange={(e) => setFormData({...formData, village: e.target.value})}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={() => setStep('identity')} className="flex-1 py-5 bg-slate-900 text-slate-400 font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl border border-slate-800 hover:text-white transition-all">Back</button>
        <button onClick={handleNext} disabled={!formData.stateId || !formData.districtId || !formData.blockId} className="flex-[2] py-5 bg-accent text-white font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">Next Step</button>
      </div>
    </div>
  );

  const renderInterests = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Interests</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Personalize Feed</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['Politics', 'Education', 'Schemes', 'Technology', 'Agriculture', 'Healthcare', 'Infrastructure', 'Environment'].map(interest => (
          <button 
            key={interest} 
            type="button"
            onClick={() => toggleInterest(interest)} 
            className={`py-5 rounded-[28px] border font-bold text-[10px] uppercase tracking-widest transition-all ${formData.interests.includes(interest) ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-accent/30'}`}
          >
            {interest}
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        <button onClick={() => setStep('location')} className="flex-1 py-5 bg-slate-900 text-slate-400 font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl border border-slate-800 hover:text-white transition-all">Back</button>
        <button onClick={handleNext} className="flex-[2] py-5 bg-gradient-to-r from-accent to-purple-600 text-white font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Finish Setup</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#08060d] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]"></div>
      </div>
      <div className="w-full max-w-lg bg-slate-950/60 backdrop-blur-3xl border border-slate-900 p-10 md:p-14 rounded-[56px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/10 rounded-[32px] mb-6 border border-accent/20 overflow-hidden">
            <img src="/JanNetra.png" alt="JanNetra Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">JanNetra</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Citizen Onboarding</p>
        </div>
        <div className="flex justify-center gap-3 mb-10">
          {(['identity', 'location', 'interests'] as SignupStep[]).map((s) => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === s ? 'bg-accent w-12 shadow-[0_0_15px_rgba(170,59,255,0.6)]' : 'bg-slate-800'}`}></div>
          ))}
        </div>
        <div className="relative">
          {step === 'identity' && renderIdentity()}
          {step === 'location' && renderLocation()}
          {step === 'interests' && renderInterests()}
        </div>
      </div>
    </div>
  );
};

export default Signup;
