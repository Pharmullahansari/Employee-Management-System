import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MiniChart } from '../components/MiniChart';
import EmployeeDashboard from './EmployeeDashboard';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { 
  HiOutlineUsers, 
  HiOutlineOfficeBuilding, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineUserAdd,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCreditCard,
  HiCheck,
  HiX,
  HiOutlineTrendingUp,
  HiOutlineGift,
  HiOutlineAcademicCap
} from 'react-icons/hi';

const Dashboard = () => {
  const { currentUser, employees, departments, leaves, attendance, activities, applyLeave, logAttendance } = useData();
  const navigate = useNavigate();
  const [celebrationTab, setCelebrationTab] = useState('all'); // 'all', 'birthday', 'anniversary'

  const [customEvents, setCustomEvents] = useState(() => {
    const saved = localStorage.getItem('customEvents');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('notices');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Quarterly Town Hall Meeting', content: 'Our next town hall is scheduled for Friday at 3:00 PM in the main conference room.', date: 'July 1, 2026', author: 'Priya Sharma (HR)' },
      { id: 2, title: 'Office Refurbishment Schedule', content: 'Post-production bay edits will be upgraded this weekend. Please backup your local directories.', date: 'June 29, 2026', author: 'Farhan Ansari (Admin)' }
    ];
  });
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  
  const [newEvent, setNewEvent] = useState({ name: '', type: 'birthday', date: '', details: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) return;
    const [year, month, day] = newEvent.date.split('-');
    const eventObj = {
      id: `custom-ev-${Date.now()}`,
      type: newEvent.type,
      name: newEvent.name,
      monthVal: parseInt(month),
      dayVal: parseInt(day),
      dateStr: `${month}/${day}`,
      dateFormatted: new Date(2026, parseInt(month) - 1, parseInt(day)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      department: 'Crew Event',
      details: newEvent.details || (newEvent.type === 'birthday' ? 'Birthday' : 'Work Anniversary')
    };
    const updated = [eventObj, ...customEvents];
    setCustomEvents(updated);
    localStorage.setItem('customEvents', JSON.stringify(updated));
    setShowEventModal(false);
    setNewEvent({ name: '', type: 'birthday', date: '', details: '' });
  };

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    const noticeObj = {
      id: Date.now(),
      title: newNotice.title,
      content: newNotice.content,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: `${currentUser.name} (${currentUser.role})`
    };
    const updated = [noticeObj, ...notices];
    setNotices(updated);
    localStorage.setItem('notices', JSON.stringify(updated));
    setShowNoticeModal(false);
    setNewNotice({ title: '', content: '' });
  };

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  // Stats Calculations
  const totalEmployees = employees.length;
  const totalDepts = departments.length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  
  // Find present today
  const today = '2026-06-27'; // simulated today date matching mock data
  const todayRecords = attendance[today] || {};
  const presentToday = Object.values(todayRecords).filter(status => status === 'Present' || status === 'Half-Day').length;
  const presentRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

  // Process Upcoming Birthdays and Anniversaries
  const celebrations = [...customEvents];
  employees.forEach(e => {
    if (e.dob) {
      const [year, month, day] = e.dob.split('-');
      celebrations.push({
        id: `${e.id}-dob`,
        type: 'birthday',
        name: e.name,
        monthVal: parseInt(month),
        dayVal: parseInt(day),
        dateStr: `${month}/${day}`,
        dateFormatted: new Date(2026, parseInt(month) - 1, parseInt(day)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        photo: e.photo,
        department: e.department,
        details: 'Birthday'
      });
    }
    if (e.joiningDate) {
      const [year, month, day] = e.joiningDate.split('-');
      const experienceYears = 2026 - parseInt(year);
      if (experienceYears > 0) {
        celebrations.push({
          id: `${e.id}-join`,
          type: 'anniversary',
          name: e.name,
          monthVal: parseInt(month),
          dayVal: parseInt(day),
          dateStr: `${month}/${day}`,
          dateFormatted: new Date(2026, parseInt(month) - 1, parseInt(day)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          photo: e.photo,
          department: e.department,
          details: `${experienceYears} Year${experienceYears > 1 ? 's' : ''} Work Anniversary`
        });
      }
    }
  });

  // Sort celebrations by proximity to simulated current date (July 1st, month=7, day=1)
  const currentSimulatedMonth = 7;
  const currentSimulatedDay = 1;
  celebrations.sort((a, b) => {
    // Calculate days until next celebration (simplistic year-independent diff)
    const getDaysScore = (month, day) => {
      let diff = (month - currentSimulatedMonth) * 30 + (day - currentSimulatedDay);
      if (diff < 0) diff += 360; // wrapping to next year
      return diff;
    };
    return getDaysScore(a.monthVal, a.dayVal) - getDaysScore(b.monthVal, b.dayVal);
  });

  const filteredCelebrations = celebrations.filter(c => {
    if (celebrationTab === 'all') return true;
    return c.type === celebrationTab;
  });

  // Department counts
  const deptDistribution = departments.map(d => {
    const count = employees.filter(e => e.department === d.name).length;
    return {
      label: d.code || d.name.substring(0, 3).toUpperCase(),
      value: count,
      fullName: d.name
    };
  });

  // Today's attendance counts for Pie Chart
  const presentCount = Object.values(todayRecords).filter(status => status === 'Present').length;
  const halfDayCount = Object.values(todayRecords).filter(status => status === 'Half-Day').length;
  const absentCount = Math.max(0, totalEmployees - presentCount - halfDayCount);

  // Dynamic department payroll growth by month (amount and month)
  const growthMonths = ['March', 'April', 'May', 'June'];
  const deptGrowthData = growthMonths.map((month, idx) => {
    // Cutoff date for each month (assuming year 2026)
    const cutoffDate = new Date(2026, 2 + idx, 31);
    const dataObj = { month };
    departments.forEach(dept => {
      // sum of salaries of crew members of this department hired before cutoffDate
      const amount = employees
        .filter(e => e.department === dept.name && new Date(e.joiningDate) <= cutoffDate)
        .reduce((sum, e) => sum + (e.salary || 0), 0);
      dataObj[dept.name] = amount;
    });
    return dataObj;
  });

  const deptGrowthSeries = departments.map((dept, index) => {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#0ea5e9'];
    return {
      data: deptGrowthData.map(d => d[dept.name] || 0),
      label: dept.code || dept.name.substring(0, 3).toUpperCase(),
      color: colors[index % colors.length]
    };
  });

  if (!currentUser) return null;

  return (
    <div className="space-y-6">

      {isAdminOrHR ? (
        /* ================= ADMIN / HR DASHBOARD ================= */
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Card 1 */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <HiOutlineUsers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Total Crew</p>
                <h3 className="text-2xl font-black mt-0.5 text-slate-800 dark:text-white">{totalEmployees}</h3>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <HiOutlineOfficeBuilding className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Departments</p>
                <h3 className="text-2xl font-black mt-0.5 text-slate-800 dark:text-white">{totalDepts}</h3>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl">
                <HiOutlineCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Active Today</p>
                <h3 className="text-2xl font-black mt-0.5 text-slate-800 dark:text-white">
                  {presentToday} <span className="text-sm font-semibold text-slate-400">/ {totalEmployees}</span>
                </h3>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <HiOutlineClock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Leaves Pending</p>
                <h3 className="text-2xl font-black mt-0.5 text-slate-800 dark:text-white">{pendingLeaves.length}</h3>
              </div>
            </div>

          </div>

          {/* Charts & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Attendance Overview Pie/Donut Chart */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400">
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Attendance Status</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Distribution</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Donut Chart (Left) */}
                  <div className="relative flex items-center justify-center flex-shrink-0 w-[140px] h-[140px] mx-auto">
                    <MuiPieChart
                      series={[
                        {
                          data: [
                            { id: 0, value: presentCount, label: 'Present', color: '#10b981' },
                            { id: 1, value: halfDayCount, label: 'Half-Day', color: '#f59e0b' },
                            { id: 2, value: absentCount, label: 'Absent', color: '#ef4444' }
                          ],
                          innerRadius: 45,
                          outerRadius: 60,
                          paddingAngle: 2,
                          cornerRadius: 3,
                        }
                      ]}
                      width={140}
                      height={140}
                      slotProps={{ legend: { hidden: true } }}
                    />
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[8px] tracking-widest text-slate-400 font-extrabold uppercase">PRESENT</span>
                      <span className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{presentCount}</span>
                    </div>
                  </div>

                  {/* Custom Legend (Right) */}
                  <div className="flex-1 w-full space-y-2">
                    {[
                      { label: 'Present', value: presentCount, color: '#10b981' },
                      { label: 'Half-Day', value: halfDayCount, color: '#f59e0b' },
                      { label: 'Absent', value: absentCount, color: '#ef4444' }
                    ].map((item) => {
                      const percentage = totalEmployees > 0 ? (item.value / totalEmployees) * 105 / 1.05 : 0;
                      return (
                        <div key={item.label} className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-655 dark:text-slate-350 font-medium">{item.label}</span>
                          </div>
                          <div className="flex items-baseline gap-1 font-bold whitespace-nowrap ml-2">
                            <span className="text-slate-800 dark:text-white">{item.value}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Department Growth Monthly Budget bar chart */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Department Growth (Monthly Payroll)</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4">Department payroll budget growth by month</p>
              </div>
              <div className="w-full flex justify-center h-[200px]">
                {deptGrowthSeries.length > 0 ? (
                  <MuiBarChart
                    xAxis={[{ scaleType: 'band', data: growthMonths }]}
                    series={deptGrowthSeries}
                    height={200}
                  />
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-xs text-slate-400">No growth data available</div>
                )}
              </div>
            </div>

          </div>

          {/* Notice Board Section */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400">
                <HiOutlineClipboardList className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Bulletin Notice Board</h3>
              </div>
              {isAdminOrHR && (
                <button 
                  onClick={() => setShowNoticeModal(true)}
                  className="px-3 py-1 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-all cursor-pointer"
                >
                  + Add Notice
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(notice => (
                <div key={notice.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-850/80 bg-slate-50/20 dark:bg-slate-950/10 hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-snug">{notice.title}</h4>
                    <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap ml-2">{notice.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{notice.content}</p>
                  <span className="text-[9px] text-indigo-500 dark:text-indigo-455 font-semibold">Posted by: {notice.author}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">System Activity Stream</h3>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-bold">Realtime</span>
            </div>
            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border border-transparent hover:border-slate-100/50 dark:hover:border-slate-850/50">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ring-4 
                    ${act.type === 'leave' ? 'bg-amber-500 ring-amber-100 dark:ring-amber-950/40' : 
                      act.type === 'attendance' ? 'bg-indigo-500 ring-indigo-100 dark:ring-indigo-950/40' : 
                      act.type === 'payroll' ? 'bg-violet-500 ring-violet-100 dark:ring-violet-950/40' : 
                      'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950/40'}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-normal">{act.text}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebrations Grid (Full Width) */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-rose-500 dark:text-rose-455">
                    <HiOutlineSparkles className="w-5 h-5" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upcoming Events</h3>
                  </div>
                  {/* Category Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg text-[10px]">
                    <button 
                      onClick={() => setCelebrationTab('all')}
                      className={`px-2 py-1 rounded-md font-bold transition-all ${celebrationTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setCelebrationTab('birthday')}
                      className={`px-2 py-1 rounded-md font-bold transition-all ${celebrationTab === 'birthday' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}
                    >
                      🎂
                    </button>
                    <button 
                      onClick={() => setCelebrationTab('anniversary')}
                      className={`px-2 py-1 rounded-md font-bold transition-all ${celebrationTab === 'anniversary' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}
                    >
                      ✨
                    </button>
                  </div>
                </div>
                
                {/* Add Event Button */}
                <button 
                  onClick={() => setShowEventModal(true)}
                  className="px-3 py-1 text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455 rounded-lg border border-rose-100 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                >
                  + Add Event
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredCelebrations.length > 0 ? (
                  filteredCelebrations.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-850/50">
                      <div className="flex items-center gap-3">
                        <img src={item.photo} alt={item.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                        <div>
                          <p className="text-xs font-bold text-slate-755 dark:text-slate-350">{item.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">{item.details}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold px-2 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 rounded-md whitespace-nowrap">
                        {item.type === 'birthday' ? '🎂' : '✨'} {item.dateFormatted}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-6 col-span-full">No events scheduled</p>
                )}
              </div>
            </div>
          </div>

          {/* Add Event Modal */}
          {showEventModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Create New Event</h4>
                  <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white cursor-pointer"><HiX className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newEvent.name} 
                      onChange={e => setNewEvent({...newEvent, name: e.target.value})} 
                      className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-850 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase mb-1">Event Type</label>
                    <select 
                      value={newEvent.type} 
                      onChange={e => setNewEvent({...newEvent, type: e.target.value})} 
                      className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-850 dark:text-white dark:bg-slate-900"
                    >
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Work Anniversary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={newEvent.date} 
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
                      className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase mb-1">Description / Details</label>
                    <input 
                      type="text" 
                      value={newEvent.details} 
                      onChange={e => setNewEvent({...newEvent, details: e.target.value})} 
                      placeholder="e.g. 5 Years Anniversary"
                      className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                    Add Event
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Add Notice Modal */}
          {showNoticeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Post New Notice</h4>
                  <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-655 dark:hover:text-white cursor-pointer"><HiX className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddNotice} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Title</label>
                    <input 
                      type="text" 
                      required 
                      value={newNotice.title} 
                      onChange={e => setNewNotice({...newNotice, title: e.target.value})} 
                      className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-850 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase mb-1">Notice Content</label>
                    <textarea 
                      required 
                      rows={3}
                      value={newNotice.content} 
                      onChange={e => setNewNotice({...newNotice, content: e.target.value})} 
                      className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                    Post Announcement
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ================= STAFF/EMPLOYEE DASHBOARD ================= */
        <EmployeeDashboard />
      )}

    </div>
  );
};

export default Dashboard;
