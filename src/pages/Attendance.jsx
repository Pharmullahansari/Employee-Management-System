import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HiOutlineCheckCircle, HiOutlineCalendar, HiPlus, HiPencil, HiTrash, HiX, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';

const Attendance = () => {
  const { currentUser, employees, attendance, logAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState('2026-06-23'); // Default matches image
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal States
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Forms states
  const [logForm, setLogForm] = useState({ employeeId: '', date: '2026-06-23', checkIn: '09:00', checkOut: '18:00', status: 'Present' });
  const [editForm, setEditForm] = useState({ employeeId: '', date: '', checkIn: '', checkOut: '', status: 'Present', originalKey: '' });

  const getFormattedDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
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
    
    // Also sync to global DataContext state
    logAttendance(logForm.date, logForm.employeeId, logForm.status === 'Present' || logForm.status === 'Late' ? 'Present' : logForm.status);
    
    setShowLogModal(false);
    setLogForm({ employeeId: '', date: '2026-06-23', checkIn: '09:00', checkOut: '18:00', status: 'Present' });
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
    
    // Also sync to global DataContext state
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
    <div className="space-y-6">
      
      {/* Upper header action bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">
          Attendance Register
        </h2>
      </div>

      {/* Attendance Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Present Card */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <HiOutlineCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Present</p>
            <h3 className="text-lg font-black mt-0.5 text-slate-800 dark:text-white">{stats.present}</h3>
          </div>
        </div>

        {/* Absent Card */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xs">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
            <HiOutlineXCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Absent</p>
            <h3 className="text-lg font-black mt-0.5 text-slate-800 dark:text-white">{stats.absent}</h3>
          </div>
        </div>

        {/* Late Card */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <HiOutlineClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Late</p>
            <h3 className="text-lg font-black mt-0.5 text-slate-800 dark:text-white">{stats.late}</h3>
          </div>
        </div>

        {/* On Leave Card */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xs">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <HiOutlineCalendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On Leave</p>
            <h3 className="text-lg font-black mt-0.5 text-slate-800 dark:text-white">{stats.leave}</h3>
          </div>
        </div>

      </div>

      {/* Date Selectors & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Field on Left */}
        <input 
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold focus:outline-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm"
        />

        {/* Date Picker & Action button on Right */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold focus:outline-indigo-500 bg-white dark:bg-slate-900 text-slate-850 dark:text-white cursor-pointer font-mono shadow-sm"
          />
          {isAdminOrHR && (
            <button 
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-sm whitespace-nowrap"
            >
              <HiPlus className="w-4 h-4" /> Log Entry
            </button>
          )}
        </div>
      </div>

      {/* Main Table Register */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
                <th className="px-4 py-3.5">Employee</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Check In</th>
                <th className="px-4 py-3.5">Check Out</th>
                <th className="px-4 py-3.5">Hours</th>
                <th className="px-4 py-3.5">Status</th>
                {isAdminOrHR && <th className="px-4 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
              {filteredEmployees.map(emp => {
                const key = `${selectedDate}-${emp.id}`;
                const record = attendanceDetails[key] || { checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' };

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={emp.photo} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 font-medium">{selectedDate}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">{record.checkIn}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">{record.checkOut}</td>
                    <td className="px-4 py-3.5 text-slate-400 font-medium">{record.hours}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full 
                          ${record.status === 'Present' ? 'bg-emerald-500' :
                            record.status === 'Absent' ? 'bg-rose-500' :
                            record.status === 'Late' ? 'bg-amber-500' :
                            'bg-yellow-500'}`} 
                        />
                        <span className={`font-semibold 
                          ${record.status === 'Present' ? 'text-emerald-500' :
                            record.status === 'Absent' ? 'text-rose-500' :
                            record.status === 'Late' ? 'text-amber-500' :
                            'text-yellow-500'}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </td>
                    {isAdminOrHR && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
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
                            className="text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLog(emp.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <HiTrash className="w-4 h-4" />
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

      {/* Log Entry Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Create Daily Log</h4>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-655 dark:hover:text-white cursor-pointer"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Crew Member</label>
                <select 
                  required
                  value={logForm.employeeId} 
                  onChange={e => setLogForm({...logForm, employeeId: e.target.value})} 
                  className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-850 dark:text-white dark:bg-slate-900"
                >
                  <option value="">Select Crew</option>
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
                  onChange={e => setLogForm({...logForm, date: e.target.value})} 
                  className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check In</label>
                  <input 
                    type="time" 
                    value={logForm.checkIn} 
                    onChange={e => setLogForm({...logForm, checkIn: e.target.value})} 
                    className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check Out</label>
                  <input 
                    type="time" 
                    value={logForm.checkOut} 
                    onChange={e => setLogForm({...logForm, checkOut: e.target.value})} 
                    className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Status</label>
                <select 
                  value={logForm.status} 
                  onChange={e => setLogForm({...logForm, status: e.target.value})} 
                  className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-850 dark:text-white dark:bg-slate-900"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                Save Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
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
                    onChange={e => setEditForm({...editForm, checkIn: e.target.value})} 
                    className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Check Out</label>
                  <input 
                    type="time" 
                    value={editForm.checkOut} 
                    onChange={e => setEditForm({...editForm, checkOut: e.target.value})} 
                    className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-855 dark:text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Status</label>
                <select 
                  value={editForm.status} 
                  onChange={e => setEditForm({...editForm, status: e.target.value})} 
                  className="w-full px-3 py-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-indigo-500 bg-transparent text-slate-850 dark:text-white dark:bg-slate-900"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
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
