import React, { useState } from 'react';
import axios from 'axios';
import { Mail, LogIn, ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requireOtp, setRequireOtp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (requireOtp) {
        // Step 2: Verify OTP
        const response = await axios.post('/api/auth/verify-otp', { email, otp });
        const userData = response.data.user;
        
        // Double check admin domain on return
        if (!userData.email.endsWith('@paywiseapp.com') && userData.email !== 'nirvanasahu9@gmail.com') {
           setError('Access denied. Admin privileges required.');
           localStorage.clear();
           return;
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/';
      } else {
        // Step 1: Request OTP (Passwordless)
        if (!email.endsWith('@paywiseapp.com') && email !== 'nirvanasahu9@gmail.com') {
           setError('Access denied. Valid @paywiseapp.com email required.');
           setLoading(false);
           return;
        }

        await axios.post('/api/auth/admin-login-otp', { email });
        setRequireOtp(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary-color)]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] shadow-2xl shadow-indigo-500/20 mb-8 border border-white/10 p-5">
            <img src="/logo.png" alt="Paywise" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-black text-color tracking-tighter sm:text-5xl">
            PAYWISE<span className="text-[var(--primary-color)]">.</span>
          </h1>
          <p className="text-color-secondary mt-3 font-semibold uppercase tracking-[0.2em] text-xs">Admin Control Portal</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm animate-in shake duration-300">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {!requireOtp ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Organization Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[var(--primary-color)] transition-colors pointer-events-none" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@paywiseapp.com"
                      className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-[20px] text-color placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[var(--primary-color)]/50 transition-all font-medium text-sm"
                      required
                      autoComplete="email"
                      spellCheck={false}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 px-2 italic font-medium text-center">
                  Passwordless session. A secure code will be sent to your inbox.
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-[var(--primary-color)]/20 text-[var(--primary-color)] mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-color">Check your email</h3>
                  <p className="text-sm text-color-secondary">We've sent a 6-digit code to <br/><span className="text-indigo-300 font-bold">{email}</span></p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 text-center block">Verification Code</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000 000"
                    className="w-full px-6 py-6 bg-white/5 border border-white/10 rounded-[24px] text-color placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[var(--primary-color)]/50 transition-all font-black text-4xl text-center tracking-[0.3em]"
                    maxLength={6}
                    required
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setRequireOtp(false)}
                  className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-color transition-colors font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Email
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-white text-slate-950 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  {requireOtp ? 'AUTHORIZE ACCESS' : 'REQUEST ACCESS CODE'}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
          <div className="h-px bg-white/10 flex-1"></div>
          <p className="text-[10px] font-black text-color uppercase tracking-[0.3em]">Internal System</p>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
