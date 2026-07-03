import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  HiOutlineUserCircle, 
  HiOutlineLockClosed, 
  HiOutlineBell, 
  HiOutlineQuestionMarkCircle,
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiX
} from 'react-icons/hi';

const Settings = () => {
  const { currentUser, setCurrentUser, updateEmployee, employees } = useData();
  const navigate = useNavigate();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [viewingDoc, setViewingDoc] = useState(null);

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  // Get active employee profile
  const myProfile = employees.find(e => e.id === currentUser?.id) || employees[0];

  // 1. Profile Information State
  const [photoUrl, setPhotoUrl] = useState(myProfile?.photo || '');
  const [fullName, setFullName] = useState(myProfile?.name || '');
  const [mobileNumber, setMobileNumber] = useState(myProfile?.phone || '');
  const [gender, setGender] = useState(myProfile?.gender || 'Male');
  const [dob, setDob] = useState(myProfile?.dob || '1990-07-05');
  const [address, setAddress] = useState(myProfile?.address || '123 Main Street, Mumbai, India');

  // 2. Account Security State
  const [username, setUsername] = useState(currentUser?.email ? currentUser.email.split('@')[0] : 'user123');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 3. Notifications Preference State
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifications: true,
    leaveStatus: true,
    attendanceAlerts: false,
    companyAnnouncements: true,
    payrollNotifications: true,
    birthdayNotifications: true
  });

  // 4. Documentation list
  const [documents, setDocuments] = useState([
    { name: 'educational_certificate.pdf', type: 'Educational Document', size: '2.4 MB', status: 'Pending', preview: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800' },
    { name: 'pan_card.jpg', type: 'PAN Card', size: '1.1 MB', status: 'Verified', preview: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800' },
    { name: 'aadhaar_card.pdf', type: 'Aadhaar Card', size: '1.8 MB', status: 'Verified', preview: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800' }
  ]);
  const [uploadType, setUploadType] = useState('PAN Card');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        name: fullName, 
        photo: photoUrl 
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      updateEmployee(currentUser.id, {
        name: fullName,
        phone: mobileNumber,
        photo: photoUrl,
        gender: gender,
        dob: dob,
        address: address
      });
    }
    triggerSuccess('Profile Information updated successfully!');
  };

  const handleTogglePref = (key) => {
    setNotifPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!password || !confirmPassword) {
      setPasswordError('Please fill in password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    setPassword('');
    setConfirmPassword('');
    triggerSuccess('Password changed successfully!');
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please choose a file first.");
      return;
    }
    const newDoc = {
      name: selectedFile.name,
      type: uploadType,
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Pending',
      preview: URL.createObjectURL(selectedFile)
    };
    setDocuments(prev => [...prev, newDoc]);
    setSelectedFile(null);
    triggerSuccess('Document uploaded successfully!');
  };

  const handleDeleteDoc = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    triggerSuccess('Document removed successfully.');
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSuccessMsg('');
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left pb-12">
      
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="text-[11px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span 
              onClick={() => navigate('/')} 
              className="hover:text-blue-600 dark:hover:text-blue-450 cursor-pointer transition-colors"
            >
              Home
            </span> &rsaquo; <span className="text-blue-500 font-extrabold">Settings</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage details, credentials, notifications, and valid docs.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-105 dark:border-emerald-900/30 animate-in fade-in duration-200">
          {successMsg || 'Changes updated successfully!'}
        </div>
      )}

      {/* 1. PROFILE INFORMATION CARD */}
      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] space-y-6">
        <div className="flex items-center gap-2 pb-1.5">
          <HiOutlineUserCircle className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-805 dark:text-white">Profile Information</h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs text-slate-700 dark:text-slate-350">
          {/* Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-200 dark:border-slate-800">
            <img 
              src={photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={fullName} 
              className="w-14 h-14 rounded-full object-cover border border-slate-205 dark:border-slate-800 ring-2 ring-blue-500/10"
            />
            <div className="flex-1 w-full space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Profile Photo</label>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-1.5 overflow-hidden w-full max-w-md">
                <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md cursor-pointer font-bold text-slate-700 dark:text-slate-300 border border-slate-200/50 flex items-center gap-1.5 select-none hover:bg-slate-200 dark:hover:bg-slate-750">
                  <HiOutlineUpload className="w-3.5 h-3.5" /> Upload Photo
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const previewUrl = URL.createObjectURL(file);
                        setPhotoUrl(previewUrl);
                      }
                    }} 
                  />
                </label>
                <span className="text-[10px] text-slate-450 truncate px-2">
                  {photoUrl.startsWith('blob:') ? 'Local preview loaded (Save to apply)' : 'Default photo loaded'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none"
              />
            </div>
            {/* Employee ID (Read Only) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee ID (Read Only)</label>
              <input 
                type="text"
                value={myProfile?.id || 'EMP001'}
                readOnly
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 dark:text-slate-400 font-mono focus:outline-none cursor-not-allowed text-slate-500"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email"
                value={myProfile?.email || 'user@company.com'}
                readOnly
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 dark:text-slate-400 focus:outline-none cursor-not-allowed text-slate-500 font-bold"
              />
            </div>
            {/* Mobile Number */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mobile Number</label>
              <input 
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* DOB */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Date of Birth</label>
              <input 
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Address</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none font-medium"
            />
          </div>

          <div className="flex justify-start pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* 2. ACCOUNT SECURITY CARD */}
      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] space-y-6">
        <div className="flex items-center gap-2 pb-1.5">
          <HiOutlineLockClosed className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Account Security</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs text-slate-700 dark:text-slate-355">
          {passwordError && (
            <div className="p-3 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-955/20 text-rose-600 border border-rose-100 dark:border-rose-900/30">
              {passwordError}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-[10px] font-bold text-slate-705 dark:text-slate-300 uppercase tracking-wider mb-1">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-705 dark:text-slate-300 uppercase tracking-wider mb-1">New Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none"
              />
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-705 dark:text-slate-300 uppercase tracking-wider mb-1">Confirm Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* 3. NOTIFICATIONS PREFERENCE CARD */}
      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] space-y-6">
        <div className="flex items-center gap-2 pb-1.5">
          <HiOutlineBell className="w-5 h-5 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notification Preferences</h3>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { key: 'emailNotifications', label: 'Email Notifications' },
            { key: 'leaveStatus', label: 'Leave Status Alerts' },
            { key: 'attendanceAlerts', label: 'Attendance Alerts' },
            { key: 'companyAnnouncements', label: 'Company Announcements' },
            { key: 'payrollNotifications', label: 'Payroll Notifications' },
            { key: 'birthdayNotifications', label: 'Birthday Notifications' }
          ].map((pref) => (
            <label key={pref.key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={notifPrefs[pref.key]}
                onChange={() => handleTogglePref(pref.key)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. DOCUMENTATION CARD */}
      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] space-y-6">
        <div className="flex items-center gap-2 pb-1.5">
          <HiOutlineDocumentText className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Job & Education Documentation</h3>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleFileUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Document Category</label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-205 dark:border-slate-805 bg-white dark:bg-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="Educational Document">Educational Document</option>
              <option value="Experience Letter">Experience Letter</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Other Document">Other Document</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">Choose File</label>
            <div className="relative flex items-center border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-1.5 overflow-hidden">
              <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md cursor-pointer font-bold text-slate-700 dark:text-slate-300 border border-slate-200/50 flex items-center gap-1.5 select-none hover:bg-slate-200 dark:hover:bg-slate-750">
                <HiOutlineUpload className="w-3.5 h-3.5" /> Select File
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} 
                />
              </label>
              <span className="text-[10px] text-slate-455 truncate px-2">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <HiOutlineUpload className="w-4 h-4" /> Upload Document
          </button>
        </form>

        {/* List of Documents */}
        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 rounded-xl text-xs gap-3">
              <div className="flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-705 dark:text-slate-205">{doc.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold">{doc.type} &bull; {doc.size}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
                {/* Status Badge */}
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                  ${doc.status === 'Verified' 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400'}`}
                >
                  {doc.status || 'Pending'}
                </span>

                {/* View Action */}
                <button
                  type="button"
                  onClick={() => setViewingDoc(doc)}
                  className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  View
                </button>

                {/* Admin-only Verify Action */}
                {isAdminOrHR && doc.status !== 'Verified' && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...documents];
                      updated[idx].status = 'Verified';
                      setDocuments(updated);
                      triggerSuccess('Document verified successfully!');
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  >
                    Verify
                  </button>
                )}

                {/* Delete Doc Button */}
                {(!doc.status || doc.status !== 'Verified' || isAdminOrHR) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/20 transition-all cursor-pointer"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HELP & SUPPORT CARD */}
      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] space-y-6">
        <div className="flex items-center gap-2 pb-1.5">
          <HiOutlineQuestionMarkCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-805 dark:text-white">Help & Support Links</h3>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
          <a href="#faq" onClick={() => alert("FAQ section: Search common queries in employee manual.")} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:text-blue-650 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 text-center transition-all">FAQ</a>
          <a href="#contact" onClick={() => alert("HR Team email: hr@company.com")} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl hover:text-blue-650 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 text-center transition-all">Contact HR</a>
          <a href="#bug" onClick={() => alert("Write to engineering@company.com to report a bug")} className="p-4 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl hover:text-blue-650 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 text-center transition-all">Report a Bug</a>
          <a href="#privacy" onClick={() => alert("Privacy policy is subject to your standard employee contract.")} className="p-4 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl hover:text-blue-650 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 text-center transition-all">Privacy Policy</a>
          <a href="#terms" onClick={() => alert("Terms & conditions are governed by regional labor regulations.")} className="p-4 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl hover:text-blue-650 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 text-center transition-all">Terms of Use</a>
        </div>
      </div>

      {/* Footer Info (App Version) */}
      <div className="text-center pt-4">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">App Version 1.0.0</span>
      </div>

      {/* Viewing Doc Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-805 dark:text-white">{viewingDoc.name}</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{viewingDoc.type} &bull; {viewingDoc.size}</span>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-405 dark:text-slate-500 cursor-pointer"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-955 rounded-xl overflow-hidden min-h-[300px] border border-slate-200/50 dark:border-slate-800 p-2">
              {viewingDoc.preview ? (
                <img 
                  src={viewingDoc.preview} 
                  alt={viewingDoc.name} 
                  className="max-h-[350px] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-450 dark:text-slate-500">
                  <HiOutlineDocumentText className="w-12 h-12" />
                  <p className="text-xs font-bold font-mono">No visual preview available (Binary file)</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
