import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MiniChart } from '../components/MiniChart';
import EmployeeDashboard from './EmployeeDashboard';
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
  HiX
} from 'react-icons/hi';

const Dashboard = () => {
  const { currentUser, employees, departments, leaves, attendance, activities, applyLeave, logAttendance } = useData();
  const navigate = useNavigate();

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

  // Upcoming Birthdays (simulated based on dob month/day)
  const upcomingBirthdays = employees.map(e => {
    const [year, month, day] = e.dob.split('-');
    return { name: e.name, date: `${month}/${day}`, department: e.department, photo: e.photo };
  });

  // Analytics mock timelines
  const growthTimeline = [2, 3, 3, 4, 4, 5]; // last 6 months employee counts
  const attendanceTimeline = [90, 94, 88, 92, 95, 98, presentRate || 92];

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-indigo-650 to-violet-700 text-black shadow-lg shadow-indigo-500/15 overflow-hidden">
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-white/20 rounded-full">
            Ansari Production
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold mt-2 tracking-tight">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-xs text-indigo-105 mt-1 max-w-md leading-relaxed">
            {isAdminOrHR 
              ? "Here's an overview of the studio crew, recent activities, and pending HR operations today."
              : `Access your work profile, attendances, upcoming holidays, and manage leave requests below. ID: ${currentUser.id}`}
          </p>
        </div>
      </div>

      {isAdminOrHR ? (
        /* ================= ADMIN / HR DASHBOARD ================= */
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Card 1 */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <HiOutlineUsers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Crew</p>
                <h3 className="text-xl font-black mt-0.5 text-slate-800 dark:text-white">{totalEmployees}</h3>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <HiOutlineOfficeBuilding className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Departments</p>
                <h3 className="text-xl font-black mt-0.5 text-slate-800 dark:text-white">{totalDepts}</h3>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl">
                <HiOutlineCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Today</p>
                <h3 className="text-xl font-black mt-0.5 text-slate-800 dark:text-white">{presentToday} <span className="text-xs font-semibold text-slate-400">/ {totalEmployees}</span></h3>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <HiOutlineClock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Leaves Pending</p>
                <h3 className="text-xl font-black mt-0.5 text-slate-800 dark:text-white">{pendingLeaves.length}</h3>
              </div>
            </div>

          </div>

          {/* Quick Actions & Upcoming Birthdays */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Quick Actions */}
            <div className="xl:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Quick Operations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button 
                  onClick={() => navigate('/add-employee')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                  <HiOutlineUserAdd className="w-6 h-6 text-indigo-505 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">New Crew</span>
                </button>
                <button 
                  onClick={() => navigate('/attendance')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                  <HiOutlineCalendar className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">Attendance</span>
                </button>
                <button 
                  onClick={() => navigate('/leaves')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                  <HiOutlineClipboardList className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">Leave Requests</span>
                </button>
                <button 
                  onClick={() => navigate('/payroll')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                  <HiOutlineCreditCard className="w-6 h-6 text-violet-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">Calc Salary</span>
                </button>
              </div>
            </div>

            {/* Upcoming Birthdays */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
                <HiOutlineSparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upcoming Birthdays</h3>
              </div>
              <div className="space-y-3">
                {upcomingBirthdays.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <img src={item.photo} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-md">
                      🎂 {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Charts & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Growth Curve */}
            <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Employee Growth</h3>
                <p className="text-[10px] text-slate-400 mb-4">Total active studio members over last 6 months</p>
              </div>
              <MiniChart type="line" data={growthTimeline} height={130} />
            </div>

            {/* Attendance Rate */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Attendance Index</h3>
                <p className="text-[10px] text-slate-400 mb-2">Today's present crew ratio</p>
              </div>
              <MiniChart type="donut" data={[presentRate]} height={110} />
            </div>

          </div>

          {/* Recent Activity List */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1.5 
                    ${act.type === 'leave' ? 'bg-amber-500' : 
                      act.type === 'attendance' ? 'bg-indigo-500' : 
                      act.type === 'payroll' ? 'bg-violet-500' : 'bg-emerald-500'}`} 
                  />
                  <div className="flex-1">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{act.text}</p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ================= STAFF/EMPLOYEE DASHBOARD ================= */
        <EmployeeDashboard />
      )}

    </div>
  );
};

export default Dashboard;
