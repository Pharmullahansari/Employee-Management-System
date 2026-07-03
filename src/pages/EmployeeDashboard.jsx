import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { HiOutlineUser, HiOutlinePlus, HiX } from 'react-icons/hi';

const CircularProgress = ({ value, max, label, color, textColor }) => {
  const navigate = useNavigate();
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = 48;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="dark:stroke-slate-800"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="block text-lg font-black font-mono" style={{ color: textColor }}>{value.toFixed(2)}</span>
          <span className="block text-[8px] text-slate-450 dark:text-slate-550 uppercase font-bold tracking-wider">Balance</span>
        </div>
      </div>
      <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-2 min-h-[32px] flex items-center justify-center leading-tight">{label}</p>
      <button
        onClick={() => navigate('/leaves')}
        className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-bold mt-1.5 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        View
      </button>
    </div>
  );
};

const EmployeeDashboard = () => {
  const { currentUser, employees, leaves, applyLeave } = useData();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-07-02');
  const [activeTab, setActiveTab] = useState('Holiday');
  const [attendanceDetails] = useState(() => {
    const saved = localStorage.getItem('attendanceDetails');
    const initial = {
      '2026-06-23-EMP003': { checkIn: '09:02', checkOut: '18:15', hours: '9.2h', status: 'Present' },
      '2026-06-23-EMP005': { checkIn: '08:45', checkOut: '17:30', hours: '8.75h', status: 'Present' },
      '2026-06-23-EMP002': { checkIn: '-', checkOut: '-', hours: '0h', status: 'Absent' },
      '2026-06-23-EMP004': { checkIn: '-', checkOut: '-', hours: '0h', status: 'On Leave' },
      '2026-06-23-EMP001': { checkIn: '09:30', checkOut: '18:00', hours: '8.5h', status: 'Late' },
      '2026-07-02-EMP003': { checkIn: '09:57 AM', checkOut: '-', hours: '-', status: 'Present' }
    };
    return saved ? JSON.parse(saved) : initial;
  });

  const myProfile = employees.find(e => e.id === currentUser?.id) || employees[0];

  const key = `${selectedDate}-${currentUser?.id}`;
  const todayRecord = attendanceDetails[key] || { checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' };
  const d = new Date(selectedDate);
  const dayNumber = String(d.getDate()).padStart(2, '0');

  const upcomingHolidays = [
    { name: 'Republic Day', date: '26 Jan', day: 'Monday', color: 'bg-red-50/50 dark:bg-red-950/10 border-l-4 border-red-500 text-red-650' },
    { name: 'Holi', date: '04 Mar', day: 'Wednesday', color: 'bg-emerald-50/50 dark:bg-emerald-950/10 border-l-4 border-emerald-500 text-emerald-600' },
    { name: 'Eid', date: '21 Mar', day: 'Saturday', color: 'bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-500 text-amber-600' },
    { name: 'Eid al-Adha', date: '28 May', day: 'Thursday', color: 'bg-cyan-50/50 dark:bg-cyan-950/10 border-l-4 border-cyan-500 text-cyan-600' }
  ];

  const generateWeekOffs = (year) => {
    const offs = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let m = 0; m < 12; m++) {
      let saturdayCount = 0;
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, m, d);
        const dayOfWeek = dateObj.getDay();
        if (dayOfWeek === 6) {
          saturdayCount++;
        }
        if (dayOfWeek === 0) {
          offs.push({
            name: 'Week Off',
            date: `${String(d).padStart(2, '0')} ${months[m]}`,
            day: 'Sunday',
            color: 'bg-indigo-50/50 dark:bg-indigo-950/10 border-l-4 border-indigo-500 text-indigo-650'
          });
        } else if (dayOfWeek === 6 && saturdayCount === 2) {
          offs.push({
            name: '2nd Sat Off',
            date: `${String(d).padStart(2, '0')} ${months[m]}`,
            day: 'Saturday',
            color: 'bg-rose-50/50 dark:bg-rose-955/10 border-l-4 border-rose-500 text-rose-600'
          });
        }
      }
    }
    return offs;
  };

  const weekOffs = generateWeekOffs(2026);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Title & Breadcrumbs */}
      <div className="flex items-baseline gap-4 mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Dashboard</h2>
        <span className="text-xs text-slate-400 font-medium">
          <span className="hover:underline cursor-pointer text-blue-500" onClick={() => navigate('/')}>Home</span> &rsaquo; My Dashboard
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Column 1: My Attendance Card */}
        <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <div className="w-full flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <HiOutlineUser className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 items-start">
              <h3 className="text-sm text-slate-800 dark:text-white font-extrabold leading-none">My Attendance</h3>
              <div className="relative flex items-center">
                <style>{`
                  .custom-date-picker::-webkit-calendar-picker-indicator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                  }
                `}</style>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="custom-date-picker text-sky-600 dark:text-sky-400 px-2 py-0.5 pr-6 text-xs border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 font-extrabold focus:outline-none cursor-pointer font-sans shadow-2xs relative w-28"
                />
                <div className="absolute right-1.5 pointer-events-none text-sky-600 dark:text-sky-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar Graphic */}
          <div className="w-32 h-36 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-md border border-blue-300 dark:border-blue-400/30 relative flex flex-col items-center justify-between overflow-hidden my-4">
            <div className="absolute top-2 left-6 w-1.5 h-4 bg-slate-200 rounded-full border border-slate-400 shadow-sm" />
            <div className="absolute top-2 right-6 w-1.5 h-4 bg-slate-200 rounded-full border border-slate-400 shadow-sm" />
            <div className="w-full bg-[#f8fafc] dark:bg-slate-950 flex-1 mt-4 rounded-b-xl flex flex-col items-center justify-center border-t border-blue-200 dark:border-slate-800">
              <span className="text-4xl font-black text-slate-800 dark:text-white font-mono mt-2">{dayNumber}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-1">{d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()}</span>
            </div>
          </div>
          
          {/* Punch Times */}
          <div className="w-full grid grid-cols-2 gap-4 text-center mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Punch In Time</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-1 font-mono">{todayRecord.checkIn || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Punch Out Time</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-1 font-mono">{todayRecord.checkOut || '-'}</p>
            </div>
          </div>
        </div>

        {/* Column 2: Holidays & Week-Offs Card */}
        <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-855 dark:text-white">Holidays / Week-Offs</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">2026</p>
          </div>
          
          {/* Tabs Nav */}
          <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 mb-4 text-xs font-bold justify-start">
            <button
              onClick={() => setActiveTab('Holiday')}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'Holiday'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-500'
                }`}
            >
              Holiday
            </button>
            <button
              onClick={() => setActiveTab('Week Off')}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'Week Off'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-500'
                }`}
            >
              Week Off
            </button>
          </div>
          
          {/* Tabs Content */}
          <div className="flex-1 overflow-y-auto max-h-[260px] pr-1 space-y-2.5 scrollbar-thin">
            {activeTab === 'Holiday' ? (
              upcomingHolidays.map((holiday, idx) => (
                <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 ${holiday.color}`}>
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white/70 dark:bg-slate-900/60 rounded-lg shadow-2xs">
                      {holiday.name}
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-bold">
                    <p>{holiday.date}</p>
                    <p className="text-slate-400 text-[8px] font-medium mt-0.5">{holiday.day}</p>
                  </div>
                </div>
              ))
            ) : (
              weekOffs.map((weekoff, idx) => (
                <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border border-slate-105 dark:border-slate-800/80 ${weekoff.color}`}>
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white/70 dark:bg-slate-900/60 rounded-lg shadow-2xs">
                      {weekoff.name}
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-bold">
                    <p>{weekoff.date}</p>
                    <p className="text-slate-400 text-[8px] font-medium mt-0.5">{weekoff.day}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columns 3 & 4: My Leaves Card (Spans 2 columns) */}
        <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-855 dark:text-white">My Leaves</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Your Info Summary</p>
            </div>
            <button
              onClick={() => navigate('/leaves?add=true')}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <HiOutlinePlus className="w-3.5 h-3.5" /> Request a Leave
            </button>
          </div>
          
          {/* Progress Circular Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 justify-items-center items-center my-auto w-full">
            <CircularProgress value={myProfile.leaveBalance.festival !== undefined ? myProfile.leaveBalance.festival : 2.00} max={2} label="Festival Holidays" color="#e2e8f0" textColor="#00c853" />
            <CircularProgress value={myProfile.leaveBalance.casual !== undefined ? myProfile.leaveBalance.casual : 10.00} max={10} label="Casual Leave" color="#6366f1" textColor="#6366f1" />
            <CircularProgress value={myProfile.leaveBalance.sick !== undefined ? myProfile.leaveBalance.sick : 2.00} max={6} label="Sick Leave" color="#f87171" textColor="#f87171" />
            <CircularProgress value={myProfile.leaveBalance.paid !== undefined ? Math.min(myProfile.leaveBalance.paid, 4) : 4.00} max={4} label="Short Leave" color="#eab308" textColor="#eab308" />
          </div>
        </div>
      </div>

      {/* Birthday, Work Anniversary, Announcement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pb-6">
        
        {/* Birthday Card */}
        <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col items-center relative pt-12 min-h-[280px]">
          <div className="absolute -top-6 w-14 h-14 bg-[#e6fcf5] dark:bg-emerald-950/45 border-4 border-white dark:border-slate-900 text-emerald-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 4a2.5 2.5 0 0 0-2.5 2.5v1.5h5V10.5A2.5 2.5 0 0 0 12 6zm-8 7h16v6H4v-6zm1-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1H5v-1z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-850 dark:text-white mt-2">Birthday</h3>
          <p className="text-xs font-bold text-[#00c853] dark:text-emerald-450 mt-1 mb-6">July - 2026</p>
          <div className="w-full flex-1 overflow-y-auto max-h-[160px] pr-1 space-y-4 scrollbar-thin">
            {[
              { name: 'Aakash Singh', date: '05-July-2026', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
              { name: 'AKASH Arya', date: '06-July-2026', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
            ].map((b, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={b.photo} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">{b.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{b.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Anniversary Card */}
        <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col items-center relative pt-12 min-h-[280px]">
          <div className="absolute -top-6 w-14 h-14 bg-[#f3f0ff] dark:bg-purple-955/45 border-4 border-white dark:border-slate-900 text-purple-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-850 dark:text-white mt-2">Work Anniversary</h3>
          <p className="text-xs font-bold text-purple-500 dark:text-purple-400 mt-1 mb-6">July - 2026</p>
          <div className="w-full flex-1 overflow-y-auto max-h-[160px] pr-1 space-y-4 scrollbar-thin">
            {[
              { name: 'Dipesh Kumar', date: '23-July-2026', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
            ].map((a, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={a.photo} alt={a.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">{a.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Card */}
        <div className="bg-white dark:bg-[#151c28] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col items-center relative pt-12 min-h-[280px]">
          <div className="absolute -top-6 w-14 h-14 bg-blue-50 dark:bg-blue-950/45 border-4 border-white dark:border-slate-900 text-blue-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-855 dark:text-white mt-2">Announcement</h3>
          <p className="text-xs font-bold text-blue-605 dark:text-blue-400 mt-1 mb-6">02-July - 2026</p>
          <div className="w-full flex-1 flex items-center justify-center text-center py-6 text-slate-400 dark:text-slate-500">
            <p className="text-sm font-semibold">No Announcements</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EmployeeDashboard;
