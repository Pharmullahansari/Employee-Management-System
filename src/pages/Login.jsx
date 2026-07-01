import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiLogin } from 'react-icons/hi';

const Login = () => {
  const { login, currentUser } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleDemoLogin = (demoRole) => {
    let emailChoice = '';
    if (demoRole === 'Admin') emailChoice = 'farhan@ansariproduction.com';
    else if (demoRole === 'HR') emailChoice = 'priya@ansariproduction.com';
    else emailChoice = 'siddharth@ansariproduction.com';

    const result = login(emailChoice, 'password', demoRole);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 relative z-10 transition-all duration-300">
        
        {/* Logo/Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-2xl shadow-lg shadow-indigo-500/25 mb-3">
            A
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
            Ansari Production
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
            Employee Workspace Portal
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Phone Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address / Phone
            </label>
            <div className="relative flex items-center">
              <HiOutlineMail className="absolute left-3 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ansariproduction.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <button 
                type="button"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <HiOutlineLockClosed className="absolute left-3 text-slate-400 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-450 hover:text-slate-650 dark:hover:text-slate-300"
              >
                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 dark:bg-slate-950 dark:border-slate-800"
            />
            <label htmlFor="remember" className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-semibold cursor-pointer">
              Remember this device
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-650 hover:from-indigo-650 hover:to-violet-750 shadow-md shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
          >
            <HiLogin className="w-5 h-5" />
            Sign In
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Quick Demo Login Personas
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('Admin')}
              className="px-2 py-1.5 text-[10px] font-bold rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:hover:bg-rose-950/20 dark:text-rose-400 transition-colors cursor-pointer"
            >
              Admin View
            </button>
            <button
              onClick={() => handleDemoLogin('HR')}
              className="px-2 py-1.5 text-[10px] font-bold rounded-lg border border-amber-200 hover:bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:hover:bg-amber-950/20 dark:text-amber-400 transition-colors cursor-pointer"
            >
              HR View
            </button>
            <button
              onClick={() => handleDemoLogin('Employee')}
              className="px-2 py-1.5 text-[10px] font-bold rounded-lg border border-indigo-200 hover:bg-indigo-50 text-indigo-600 dark:border-indigo-900/30 dark:hover:bg-indigo-950/20 dark:text-indigo-400 transition-colors cursor-pointer"
            >
              Staff View
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
