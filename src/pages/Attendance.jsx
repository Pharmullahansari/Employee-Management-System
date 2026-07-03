import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HiOutlineCheckCircle, HiOutlineCalendar, HiPlus, HiPencil, HiTrash, HiX, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';

const Attendance = () => {
  const { currentUser, employees, attendance, logAttendance } = useData();
  
  const getTodayDateStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  // Sync detailed check-in, check-out and hours in localStorage
  const [attendanceDetails, setAttendanceDetails] = useState(() => {
    const saved = localStorage.getItem('attendanceDetails');
    const initial = {
      // Pre-populate mock records matching reference image for 2026-06-23
      '2026-06-23-EMP003': { checkIn: '09:02', checkOut: '18:15', hours: '9.2h', status: 'Present' }, // Siddharth Roy (acting as Sarah Chen)
      '2026-06-23-EMP005': { checkIn: '08:45', checkOut: '17:30', hours: '8.75h', status: 'Present' }, // Kabir Mehta (acting as Marcus Reid)
      '2026-06-23-EMP002': { checkIn: '-', checkOut: '-', hours: '0h', status: 'Absent' }, // Priya Sharma (acting as Aisha Patel)
      '2026-06-23-EMP004': { checkIn: '-', checkOut: '-', hours: '0h', status: 'On Leave' }, // Zara Sheikh (acting as James Okonkwo)
      '2026-06-23-EMP001': { checkIn: '09:30', checkOut: '18:00', hours: '8.5h', status: 'Late' } // Farhan Ansari (acting as Luna Vasquez)
    };
    return saved ? JSON.parse(saved) : initial;
  });

  // Calculate stats for selected date
  const stats = employees.reduce((acc, emp) => {
    const key = `${selectedDate}-${emp.id}`;
    const record = attendanceDetails[key] || { status: 'Absent' };
    if (record.status === 'Present') acc.present++;
    else if (record.status === 'Absent') acc.absent++;
    else if (record.status === 'Late') acc.late++;
    else if (record.status === 'On Leave') acc.leave++;
    return acc;
  }, { present: 0, absent: 0, leave: 0, late: 0 });

  const employeeStats = Object.entries(attendanceDetails)
    .filter(([key]) => key.endsWith(`-${currentUser?.id}`))
    .reduce((acc, [_, record]) => {
      if (record.status === 'Present') acc.present++;
      else if (record.status === 'Absent') acc.absent++;
      else if (record.status === 'Late') acc.late++;
      else if (record.status === 'On Leave') acc.leave++;
      return acc;
    }, { present: 0, absent: 0, leave: 0, late: 0 });

  const displayStats = isAdminOrHR ? stats : employeeStats;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (isAdminOrHR) {
      return matchesSearch;
    }
    return emp.id === currentUser?.id && matchesSearch;
  });

  // Modal States
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Forms states
  const [logForm, setLogForm] = useState({ employeeId: '', date: getTodayDateStr(), checkIn: '09:00', checkOut: '18:00', status: 'Present' });
  const [editForm, setEditForm] = useState({ employeeId: '', date: '', checkIn: '', checkOut: '', status: 'Present', originalKey: '' });

  const todayRecordKey = currentUser ? `${selectedDate}-${currentUser.id}` : '';
  const todayRecord = todayRecordKey ? (attendanceDetails[todayRecordKey] || { checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' }) : null;

  const handleEmployeeCheckIn = () => {
    if (!currentUser) return;
    const now = new Date();
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minutesStr = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hoursStr}:${minutesStr}`;

    const status = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15) ? 'Late' : 'Present';
    const key = `${selectedDate}-${currentUser.id}`;

    const updatedDetails = {
      ...attendanceDetails,
      [key]: {
        checkIn: timeStr,
        checkOut: '-',
        hours: '0h',
        status: status
      }
    };

    setAttendanceDetails(updatedDetails);
    localStorage.setItem('attendanceDetails', JSON.stringify(updatedDetails));
    logAttendance(selectedDate, currentUser.id, status);
  };

  const handleEmployeeCheckOut = () => {
    if (!currentUser) return;
    const key = `${selectedDate}-${currentUser.id}`;
    const record = attendanceDetails[key] || { checkIn: '09:00', status: 'Present' };
    const now = new Date();
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minutesStr = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hoursStr}:${minutesStr}`;

    const hours = calculateHours(record.checkIn, timeStr);

    const updatedDetails = {
      ...attendanceDetails,
      [key]: {
        ...record,
        checkOut: timeStr,
        hours: hours
      }
    };

    setAttendanceDetails(updatedDetails);
    localStorage.setItem('attendanceDetails', JSON.stringify(updatedDetails));
    logAttendance(selectedDate, currentUser.id, record.status);
  };

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime || inTime === '-' || outTime === '-') return '-';
    try {
      const [inH, inM] = inTime.split(':').map(Number);
      const [outH, outM] = outTime.split(':').map(Number);
      const diffMs = (outH * 60 + outM) - (inH * 60 + inM);
      if (diffMs <= 0) return '0h';
      const hrs = diffMs / 60;
      return `${hrs.toFixed(2).replace(/\.00$/, '')}h`;
    } catch (e) {
      return '0h';
    }
  };

  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!logForm.employeeId || !logForm.date) return;

    const key = `${logForm.date}-${logForm.employeeId}`;
    const hours = calculateHours(logForm.checkIn, logForm.checkOut);

    const updatedDetails = {
      ...attendanceDetails,
      [key]: {
        checkIn: logForm.status === 'Absent' || logForm.status === 'On Leave' ? '-' : logForm.checkIn,
        checkOut: logForm.status === 'Absent' || logForm.status === 'On Leave' ? '-' : logForm.checkOut,
        hours: logForm.status === 'Absent' || logForm.status === 'On Leave' ? '0h' : hours,
        status: logForm.status
      }
    };

    setAttendanceDetails(updatedDetails);
    localStorage.setItem('attendanceDetails', JSON.stringify(updatedDetails));

    logAttendance(logForm.date, logForm.employeeId, logForm.status === 'Present' || logForm.status === 'Late' ? 'Present' : logForm.status);

    setShowLogModal(false);
    setLogForm({ employeeId: '', date: getTodayDateStr(), checkIn: '09:00', checkOut: '18:00', status: 'Present' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const key = editForm.originalKey;
    const hours = calculateHours(editForm.checkIn, editForm.checkOut);

    const updatedDetails = {
      ...attendanceDetails,
      [key]: {
        checkIn: editForm.status === 'Absent' || editForm.status === 'On Leave' ? '-' : editForm.checkIn,
        checkOut: editForm.status === 'Absent' || editForm.status === 'On Leave' ? '-' : editForm.checkOut,
        hours: editForm.status === 'Absent' || editForm.status === 'On Leave' ? '0h' : hours,
        status: editForm.status
      }
    };

    setAttendanceDetails(updatedDetails);
    localStorage.setItem('attendanceDetails', JSON.stringify(updatedDetails));

    logAttendance(editForm.date, editForm.employeeId, editForm.status === 'Present' || editForm.status === 'Late' ? 'Present' : editForm.status);

    setShowEditModal(false);
  };

  const handleDeleteLog = (empId) => {
    const key = `${selectedDate}-${empId}`;
    const updatedDetails = { ...attendanceDetails };
    delete updatedDetails[key];
    setAttendanceDetails(updatedDetails);
    localStorage.setItem('attendanceDetails', JSON.stringify(updatedDetails));
  };

  return (
    <div className="space-y-6 text-left">

      {/* Upper header action bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Home &rsaquo; <span className="text-blue-500 font-extrabold">Attendance Register</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Attendance Register
          </h2>
        </div>
      </div>

      {/* Employee Today Attendance Check-In/Out Card (Moved to Top) */}
      {!isAdminOrHR && currentUser && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-3">MY ATTENDANCE — TODAY</p>
            <div className="flex flex-wrap gap-8 text-xs">
              <div>
                <p className="text-slate-400 dark:text-slate-500 font-bold mb-1">Check In</p>
                <p className="font-mono text-sm font-extrabold text-slate-800 dark:text-white">{todayRecord?.checkIn || '-'}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 font-bold mb-1">Check Out</p>
                <p className="font-mono text-sm font-extrabold text-slate-800 dark:text-white">{todayRecord?.checkOut || '-'}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 font-bold mb-1">Status</p>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full 
                    ${todayRecord?.status === 'Present' ? 'bg-emerald-500' :
                      todayRecord?.status === 'Absent' ? 'bg-rose-500' :
                        todayRecord?.status === 'Late' ? 'bg-amber-500' :
                          'bg-yellow-500'}`}
                  />
                  <span className={
                    todayRecord?.status === 'Present' ? 'text-emerald-500 dark:text-emerald-400' :
                      todayRecord?.status === 'Absent' ? 'text-rose-500 dark:text-rose-400' :
                        todayRecord?.status === 'Late' ? 'text-amber-500 dark:text-amber-400' :
                          'text-yellow-500 dark:text-yellow-400'
                  }>
                    {todayRecord?.status || 'Absent'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Check In / Out Button */}
            {(!todayRecord?.checkIn || todayRecord.checkIn === '-') ? (
              <button
                onClick={handleEmployeeCheckIn}
                className="flex items-center gap-1.5 px-4 py-2 border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-50 dark:bg-[#002611] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-[#00e676] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.571V9a4 4 0 00-8 0v2.571c0 2.213.626 4.3 1.716 6.071m1.716-6.071A9.01 9.01 0 006 9V7.128a3 3 0 011.834-2.772l1.624-.65a9 9 0 018.172 0l1.624.65A3 3 0 0121 7.128V9c0 1.95-.623 3.757-1.682 5.234m-9.08 5.344L11 20M15 11h.01M19 11h.01M15 15h.01" /></svg>
                Check In
              </button>
            ) : (!todayRecord.checkOut || todayRecord.checkOut === '-') ? (
              <button
                onClick={handleEmployeeCheckOut}
                className="flex items-center gap-1.5 px-4 py-2 border border-rose-500/20 dark:border-rose-500/30 bg-rose-50 dark:bg-[#2b000a] hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-[#ff1744] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 003 3h4a3 3 0 003-3V7a3 3 0 00-3-3h-4a3 3 0 00-3 3v1" /></svg>
                Check Out
              </button>
            ) : (
              <button
                onClick={handleEmployeeCheckIn}
                className="flex items-center gap-1.5 px-4 py-2 border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-50 dark:bg-[#002611] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-[#00e676] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.571V9a4 4 0 00-8 0v2.571c0 2.213.626 4.3 1.716 6.071m1.716-6.071A9.01 9.01 0 006 9V7.128a3 3 0 011.834-2.772l1.624-.65a9 9 0 018.172 0l1.624.65A3 3 0 0121 7.128V9c0 1.95-.623 3.757-1.682 5.234m-9.08 5.344L11 20M15 11h.01M19 11h.01M15 15h.01" /></svg>
                Check In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Attendance Stats Cards Grid (Colorful Top-bordered layouts) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">        {/* Present Card */}
        <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-emerald-500 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_12px_25px_rgba(16,185,129,0.18)]">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-xl">
            <HiOutlineCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Present</p>
            <h3 className="text-xl font-bold mt-0.5 text-slate-800 dark:text-white tracking-tight">{displayStats.present}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">
              {((displayStats.present / (employees.length || 1)) * 100).toFixed(0)}% present rate
            </p>
          </div>
        </div>

        {/* Absent Card */}
        <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-rose-500 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(244,63,94,0.1)] dark:hover:shadow-[0_12px_25px_rgba(244,63,94,0.18)]">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-xl">
            <HiOutlineXCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Absent</p>
            <h3 className="text-xl font-bold mt-0.5 text-slate-800 dark:text-white tracking-tight">{displayStats.absent}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">
              {((displayStats.absent / (employees.length || 1)) * 100).toFixed(0)}% absent rate
            </p>
          </div>
        </div>

        {/* Late Card */}
        <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-amber-500 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.1)] dark:hover:shadow-[0_12px_25px_rgba(245,158,11,0.18)]">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-500/20 text-amber-500 dark:text-amber-400 rounded-xl">
            <HiOutlineClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Late</p>
            <h3 className="text-xl font-bold mt-0.5 text-slate-800 dark:text-white tracking-tight">{displayStats.late}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">
              {((displayStats.late / (employees.length || 1)) * 100).toFixed(0)}% late rate
            </p>
          </div>
        </div>

        {/* On Leave Card */}
        <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-yellow-500 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(234,179,8,0.1)] dark:hover:shadow-[0_12px_25px_rgba(234,179,8,0.18)]">
          <div className="p-2.5 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-500/20 text-yellow-500 dark:text-yellow-400 rounded-xl">
            <HiOutlineCalendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On Leave</p>
            <h3 className="text-xl font-bold mt-0.5 text-slate-800 dark:text-white tracking-tight">{displayStats.leave}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">
              {((displayStats.leave / (employees.length || 1)) * 100).toFixed(0)}% leave rate
            </p>
          </div>
        </div>

      </div>

      {/* Main Table Register Card (Full-width style) */}
      <div className="bg-white dark:bg-[#151c28] border border-slate-200 dark:border-[#222e43] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden py-5 space-y-4">
        
        {/* Table Filter Controls bar inside card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-1 px-5">
          {/* Entries & Search selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-slate-400 font-medium">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-250 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>Records per page</span>
            </div>

            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="px-4 py-1.5 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs w-48"
            />
          </div>

          {/* Date Picker & Action button on Right */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-1.5 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white cursor-pointer font-mono shadow-xs"
            />
            {isAdminOrHR && (
              <button
                onClick={() => setShowLogModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <HiPlus className="w-4 h-4" /> Log Entry
              </button>
            )}
          </div>
        </div>

        {/* Table grid */}
        <div className="overflow-x-auto border-y border-slate-200 dark:border-[#222e43]/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#222e43] bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Employee</th>
                <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Date</th>
                <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Check In</th>
                <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Check Out</th>
                <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Hours</th>
                <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {(() => {
                const totalEntries = filteredEmployees.length;
                const totalPages = Math.ceil(totalEntries / pageSize) || 1;
                const startIndex = (currentPage - 1) * pageSize;
                const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

                if (paginatedEmployees.length === 0) {
                  return (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-400 border-b border-slate-200 dark:border-[#222e43]">
                        No records found matching search filters.
                      </td>
                    </tr>
                  );
                }

                return paginatedEmployees.map(emp => {
                  const key = `${selectedDate}-${emp.id}`;
                  const record = attendanceDetails[key] || { checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' };

                  return (
                    <tr key={emp.id} className="border-b border-slate-200 dark:border-[#222e43]/50 hover:bg-gray-100 dark:hover:bg-slate-800/40 transition-colors duration-150">
                      {/* Employee Profile */}
                      <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={emp.photo} 
                            alt={emp.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-850" 
                          />
                          <span className="font-bold text-slate-850 dark:text-slate-200">{emp.name}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 text-slate-400 dark:text-slate-500 font-mono font-semibold">
                        {selectedDate}
                      </td>

                      {/* Check In */}
                      <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {record.checkIn}
                      </td>

                      {/* Check Out */}
                      <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {record.checkOut}
                      </td>

                      {/* Hours */}
                      <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 text-slate-450 dark:text-slate-500 font-mono font-bold">
                        {record.hours}
                      </td>

                      {/* Status Badge */}
                      <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full 
                            ${record.status === 'Present' ? 'bg-emerald-500' :
                              record.status === 'Absent' ? 'bg-rose-500' :
                                record.status === 'Late' ? 'bg-amber-500' :
                                  'bg-yellow-500'}`}
                          />
                          <span className={`font-bold uppercase tracking-wider text-[10px]
                            ${record.status === 'Present' ? 'text-emerald-500' :
                              record.status === 'Absent' ? 'text-rose-500' :
                                record.status === 'Late' ? 'text-amber-500' :
                                  'text-yellow-550'}`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-center">
                        {isAdminOrHR ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditForm({
                                  employeeId: emp.id,
                                  date: selectedDate,
                                  checkIn: record.checkIn === '-' ? '09:00' : record.checkIn,
                                  checkOut: record.checkOut === '-' ? '18:00' : record.checkOut,
                                  status: record.status,
                                  originalKey: key
                                });
                                setShowEditModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-md transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <HiPencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLog(emp.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[10px]">Read-only</span>
                        )}
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer controls */}
        {(() => {
          const totalEntries = filteredEmployees.length;
          const totalPages = Math.ceil(totalEntries / pageSize) || 1;
          const startIndex = (currentPage - 1) * pageSize;

          return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-5">
              {/* Entries summary */}
              <div className="text-xs text-slate-450 dark:text-slate-400 font-semibold">
                {totalEntries > 0 ? (
                  `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, totalEntries)} of ${totalEntries} entries`
                ) : (
                  'Showing 0 to 0 of 0 entries'
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {/* Page Index indicator */}
                <span className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm font-mono">
                  {currentPage}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Last
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Log Entry Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-left">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Create Daily Log</h4>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-655 dark:hover:text-white cursor-pointer"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Employee</label>
                <select
                  required
                  value={logForm.employeeId}
                  onChange={e => setLogForm({ ...logForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-850 dark:text-white dark:bg-slate-900 cursor-pointer"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={logForm.date}
                  onChange={e => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check In</label>
                  <input
                    type="time"
                    value={logForm.checkIn}
                    onChange={e => setLogForm({ ...logForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check Out</label>
                  <input
                    type="time"
                    value={logForm.checkOut}
                    onChange={e => setLogForm({ ...logForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Status</label>
                <select
                  value={logForm.status}
                  onChange={e => setLogForm({ ...logForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white dark:bg-slate-900 cursor-pointer"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                Save Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-left">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Edit Check-in Entry</h4>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-655 dark:hover:text-white cursor-pointer"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check In</label>
                  <input
                    type="time"
                    value={editForm.checkIn}
                    onChange={e => setEditForm({ ...editForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check Out</label>
                  <input
                    type="time"
                    value={editForm.checkOut}
                    onChange={e => setEditForm({ ...editForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent text-slate-855 dark:text-white dark:bg-slate-900 cursor-pointer"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                Update Entry
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Attendance;
