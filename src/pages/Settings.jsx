import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HiOutlineBell, HiOutlineSparkles, HiOutlineUserCircle, HiOutlineLockClosed } from 'react-icons/hi';

const Settings = () => {
  const { settings, updateSettingsState, currentUser, setCurrentUser, updateEmployee } = useData();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState({ ...settings });

  // Employee-specific settings states
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photo || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleToggle = (key) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTextChange = (key, val) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save system/notification configurations
    updateSettingsState(localSettings);

    // Save profile picture updates
    if (currentUser) {
      const updatedUser = { ...currentUser, photo: photoUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      updateEmployee(currentUser.id, { photo: photoUrl });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    // Mock validation success
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {saveSuccess && (
        <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 animate-in fade-in duration-200">
          Settings updated successfully! Changes applied.
        </div>
      )}

      {/* Profile Picture Upload & Info */}
      {currentUser && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineUserCircle className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Employee Profile Settings</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img 
              src={photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={currentUser.name} 
              className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/10 border border-slate-200 dark:border-slate-800"
            />
            <div className="flex-1 w-full text-xs space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Profile Photo URL</label>
              <input 
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">Paste any image URL to dynamically update your avatar.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Notification rules */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineBell className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">System Alerts & Notifications</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Email Notifications</p>
                <p className="text-[10px] text-slate-400">Receive summaries for payroll transfers and approvals.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer
                  ${localSettings.emailNotifications ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform
                  ${localSettings.emailNotifications ? 'translate-x-5.5' : 'translate-x-1'}`} 
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Push Notifications</p>
                <p className="text-[10px] text-slate-400">Receive alerts when an employee files a leave request.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer
                  ${localSettings.pushNotifications ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform
                  ${localSettings.pushNotifications ? 'translate-x-5.5' : 'translate-x-1'}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: AI Persona Configuration (Antigravity customization!) */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineSparkles className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Antigravity AI Personalization</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">Customize my behavior and response styles in your local workspace.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Companion Assistant Name</label>
              <input 
                type="text"
                value={localSettings.aiPersonaName}
                onChange={(e) => handleTextChange('aiPersonaName', e.target.value)}
                placeholder="e.g. Antigravity AI"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none font-semibold text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Response Tone Style</label>
                <select
                  value={localSettings.aiResponseStyle}
                  onChange={(e) => handleTextChange('aiResponseStyle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="professional">Professional & Technical</option>
                  <option value="witty">Witty & Friendly</option>
                  <option value="minimalist">Concise & Minimalist</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Creativity Index (Temperature: {localSettings.aiTemperature})</label>
                <input 
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={localSettings.aiTemperature}
                  onChange={(e) => handleTextChange('aiTemperature', e.target.value)}
                  className="w-full accent-indigo-650 cursor-pointer mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Main Settings */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 transition-colors shadow-sm cursor-pointer"
          >
            Apply Settings
          </button>
        </div>
      </form>

      {/* Password Reset Form */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <HiOutlineLockClosed className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Reset Account Password</h3>
        </div>

        {passwordError && (
          <div className="p-3 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Password</label>
            <input 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm New Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Settings;
