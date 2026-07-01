import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HiOutlineDocumentText, HiOutlineCalendar, HiOutlineBadgeCheck, HiCheck, HiX } from 'react-icons/hi';

const Leave = () => {
  const { currentUser, leaves, applyLeave, updateLeaveStatus, employees } = useData();

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  // Form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Find leave balance for self
  const myProfile = employees.find(e => e.id === currentUser?.id) || employees[0];

  const handleApply = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert("Please enter valid dates and reasons.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    if (daysDiff <= 0) {
      alert("End date must be after start date.");
      return;
    }

    const payload = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      type: leaveType,
      startDate,
      endDate,
      days: daysDiff,
      reason
    };

    applyLeave(payload);
    setSuccessMsg('Leave request submitted successfully. Awaiting HR review!');
    setStartDate('');
    setEndDate('');
    setReason('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Filter requests shown
  const visibleLeaves = isAdminOrHR ? leaves : leaves.filter(l => l.employeeId === currentUser?.id);

  return (
    <div className="space-y-6">
      
      {/* Leave Balance Grid */}
      {myProfile && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Casual balance</p>
            <h3 className="text-xl font-black text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.casual} <span className="text-xs font-semibold text-slate-400">/ 10 Days</span></h3>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sick balance</p>
            <h3 className="text-xl font-black text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.sick} <span className="text-xs font-semibold text-slate-400">/ 10 Days</span></h3>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Paid balance</p>
            <h3 className="text-xl font-black text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.paid} <span className="text-xs font-semibold text-slate-400">/ 15 Days</span></h3>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Leave application form (For everyone, but makes sense especially for staff) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HiOutlineDocumentText className="w-5 h-5 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">File Leave Application</h3>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Paid Leave">Paid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">End Date</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Detailed Reason</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason for leave..."
                rows="3"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Submit Application
            </button>
          </form>
        </div>

        {/* Leave Requests Log List */}
        <div className="xl:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HiOutlineBadgeCheck className="w-5 h-5 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isAdminOrHR ? "All Leave Requests" : "Your Leave Log"}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {visibleLeaves.length > 0 ? (
                  visibleLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{l.employeeName}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {l.startDate} <span className="text-[10px] text-slate-400">to</span> {l.endDate}
                        <div className="text-[10px] text-slate-400 mt-0.5">{l.days} Days</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">{l.type}</td>
                      <td className="px-4 py-3 text-slate-500 italic max-w-xs truncate" title={l.reason}>
                        {l.reason}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                            ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                              l.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                              'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455'}`}
                          >
                            {l.status}
                          </span>

                          {/* HR approval panel actions */}
                          {isAdminOrHR && l.status === 'Pending' && (
                            <div className="flex items-center gap-1 mt-1">
                              <button
                                onClick={() => updateLeaveStatus(l.id, 'Approved')}
                                className="p-1 rounded bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:bg-emerald-950/30 transition-all cursor-pointer"
                                title="Approve"
                              >
                                <HiCheck className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => updateLeaveStatus(l.id, 'Rejected')}
                                className="p-1 rounded bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 dark:bg-rose-950/30 transition-all cursor-pointer"
                                title="Reject"
                              >
                                <HiX className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      No leave requests filed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Leave;
