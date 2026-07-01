import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HiOutlineCheckCircle, HiOutlineCalendar, HiCheck, HiX, HiClock } from 'react-icons/hi';

const Attendance = () => {
  const { currentUser, employees, attendance, logAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState('2026-06-27');
  const [selectedMonth, setSelectedMonth] = useState('2026-06');

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  const todayRecords = attendance[selectedDate] || {};

  const handleMark = (empId, status) => {
    logAttendance(selectedDate, empId, status);
  };

  // Generate calendar days for visual checklist
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${String(dayNum).padStart(2, '0')}`;
    
    // Get status for current logged-in employee on this day
    const dayRecords = attendance[dateStr] || {};
    const myStatus = currentUser ? dayRecords[currentUser.id] : null;

    return {
      day: dayNum,
      date: dateStr,
      status: myStatus || (dayNum === 27 ? 'Present' : dayNum === 26 ? 'Absent' : dayNum < 26 ? 'Present' : 'Not Marked')
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Date Selectors & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Ansari Production Registry</p>
          <h2 className="text-base lg:text-lg font-bold text-slate-800 dark:text-white">Attendance Ledger & Registers</h2>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center">
            <span className="text-slate-400 font-semibold mr-2">Target Date:</span>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-bold focus:outline-none cursor-pointer font-mono"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Daily Attendance Sheet */}
        <div className="xl:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HiOutlineCheckCircle className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Daily Attendance Log</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Check-in State</th>
                  {isAdminOrHR && <th className="px-4 py-3 text-center">Modify</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {employees.map(emp => {
                  const markedStatus = todayRecords[emp.id];
                  
                  // For normal employees, they can only view or check-in themselves
                  const isSelf = currentUser && currentUser.id === emp.id;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={emp.photo} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${markedStatus === 'Present' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                            markedStatus === 'Absent' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' :
                            markedStatus === 'Half-Day' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                            'bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-500'}`}
                        >
                          {markedStatus || 'Unmarked'}
                        </span>
                      </td>
                      
                      {/* Controls */}
                      {(isAdminOrHR || isSelf) && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleMark(emp.id, 'Present')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded cursor-pointer"
                              title="Mark Present"
                            >
                              <HiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMark(emp.id, 'Half-Day')}
                              className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded cursor-pointer"
                              title="Mark Half-Day"
                            >
                              <HiClock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMark(emp.id, 'Absent')}
                              className="p-1 text-rose-600 hover:bg-rose-55 hover:text-rose-600 dark:hover:bg-rose-950/20 rounded cursor-pointer"
                              title="Mark Absent"
                            >
                              <HiX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar visual view */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HiOutlineCalendar className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Your Calendar (June)</h3>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">
            <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Pad calendar for day offset (June 2026 starts on Monday) */}
            {calendarDays.map(dayObj => (
              <div 
                key={dayObj.day}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-semibold select-none transition-all
                  ${dayObj.status === 'Present' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' :
                    dayObj.status === 'Absent' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30' :
                    dayObj.status === 'Half-Day' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30' :
                    'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-550 border border-slate-100 dark:border-slate-800'}`}
                title={`${dayObj.date}: ${dayObj.status}`}
              >
                {dayObj.day}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-[10px] text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 inline-block" />
              <span>Present Duty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 inline-block" />
              <span>Half Day / Late Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 inline-block" />
              <span>Unexcused Absence</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Attendance;
