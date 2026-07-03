import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { HiOutlineDocumentText, HiOutlineBadgeCheck, HiCheck, HiX, HiOutlinePlus } from 'react-icons/hi';

const Leave = () => {
  const { currentUser, leaves, applyLeave, updateLeaveStatus, employees } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isAdding = searchParams.get('add') === 'true';

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  // Form states
  const [leaveApplyFor, setLeaveApplyFor] = useState('Please Select');
  const [leaveType, setLeaveType] = useState('Please Select');
  const [duration, setDuration] = useState('Single');
  const [fromDate, setFromDate] = useState('2026-07-02');
  const [toDate, setToDate] = useState('2026-07-02');
  const [numDays, setNumDays] = useState(1);
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Calculate days difference
  useEffect(() => {
    if (duration === 'Single') {
      setNumDays(1);
    } else {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 600 * 60 * 24)) + 1;
      setNumDays(isNaN(diffDays) ? 1 : Math.max(1, diffDays));
    }
  }, [duration, fromDate, toDate]);

  // Find leave balance for self
  const myProfile = employees.find(e => e.id === currentUser?.id) || employees[0];

  const handleApply = (e) => {
    e.preventDefault();
    if (leaveApplyFor === 'Please Select' || leaveType === 'Please Select') {
      alert("Please select Leave Apply For and Leave Type options.");
      return;
    }
    if (!fromDate || !reason) {
      alert("Please select date and enter reason.");
      return;
    }

    const payload = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      type: leaveType,
      startDate: fromDate,
      endDate: duration === 'Single' ? fromDate : toDate,
      days: numDays,
      reason: `[${leaveApplyFor}] - ${reason}`
    };

    applyLeave(payload);
    setSuccessMsg('Leave request submitted successfully. Awaiting HR review!');
    
    // Clear form
    setLeaveApplyFor('Please Select');
    setLeaveType('Please Select');
    setDuration('Single');
    setFromDate('2026-07-02');
    setToDate('2026-07-02');
    setReason('');
    setFileName('');

    setTimeout(() => {
      setSuccessMsg('');
      navigate('/leaves');
    }, 3000);
  };

  const handleReset = () => {
    setLeaveApplyFor('Please Select');
    setLeaveType('Please Select');
    setDuration('Single');
    setFromDate('2026-07-02');
    setToDate('2026-07-02');
    setReason('');
    setFileName('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const visibleLeaves = isAdminOrHR ? leaves : leaves.filter(l => l.employeeId === currentUser?.id);

  return (
    <div className="space-y-6 text-left">
      
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="text-[11px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span 
              onClick={() => navigate('/')} 
              className="hover:text-blue-600 dark:hover:text-blue-450 cursor-pointer transition-colors"
            >
              Home
            </span> &rsaquo;{' '}
            <span 
              onClick={() => navigate('/leaves')} 
              className="hover:text-blue-600 dark:hover:text-blue-450 cursor-pointer transition-colors"
            >
              Leave Log
            </span>
            {isAdding && <> &rsaquo; <span className="text-blue-500 font-extrabold">Apply Leave</span></>}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {isAdding ? 'Apply Leave Request' : 'Leave Management'}
          </h2>
        </div>
        {!isAdding && !isAdminOrHR && (
          <button
            onClick={() => navigate('/leaves?add=true')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> Apply Leave
          </button>
        )}
      </div>

      {isAdding ? (
        /* Apply Leave Page Layout */
        <div className="bg-white dark:bg-[#151c28] border border-gray-200 dark:border-[#222e43] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#222e43]/60">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Apply Leave Form</h3>
          </div>

          <form onSubmit={handleApply} className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-350">
            {successMsg && (
              <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                {successMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Leave Apply For */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  Leave Apply For <span className="text-rose-500">*</span>
                </label>
                <select
                  value={leaveApplyFor}
                  onChange={(e) => setLeaveApplyFor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Please Select">Please Select</option>
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Short Leave">Short Leave</option>
                </select>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  Leave Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Please Select">Please Select</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Paid Leave">Paid Leave</option>
                </select>
              </div>

              {/* Leave Duration */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  Leave Duration <span className="text-rose-500">*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>

              {/* No. of leaves */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  No. of leaves <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={numDays}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-955/60 dark:text-slate-400 font-extrabold focus:outline-none cursor-not-allowed text-slate-500"
                />
              </div>

              {/* From Date */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  From Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none font-mono"
                />
              </div>

              {/* To Date (Only if Multiple) */}
              {duration === 'Multiple' ? (
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                    To Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none font-mono"
                  />
                </div>
              ) : (
                <div className="hidden md:block" />
              )}

              {/* Reason for Leave */}
              <div className="md:col-span-1">
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  Reason for Leave <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason here..."
                  rows="4"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 dark:text-white focus:outline-none"
                />
              </div>

              {/* Upload Document */}
              <div className="md:col-span-1">
                <label className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-1.5">
                  Upload Document <span className="text-[#f43f5e]">(Max 7 MB)</span>
                </label>
                <div className="flex items-center gap-2 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-950 p-1.5">
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 rounded-lg cursor-pointer text-slate-700 dark:text-slate-350 font-bold border border-gray-200 dark:border-slate-800/50 transition-all select-none">
                    Choose File
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500 truncate px-2">
                    {fileName || 'No file chosen'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 dark:text-slate-550 font-bold mt-1.5">
                  eg: image,pdf,doc
                </p>
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-gray-200 dark:border-slate-800 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Reset
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Leave Log List & Balance Cards (Standard View) */
        <>
          {/* Leave Balance Grid (Colorful Top-bordered borderless cards) */}
          {myProfile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Casual Leave */}
              <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-blue-500 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_25px_rgba(59,130,246,0.1)]">
                <p className="text-[10px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Casual balance</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.casual} <span className="text-xs font-semibold text-slate-400">/ 10 Days</span></h3>
              </div>

              {/* Sick Leave */}
              <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-rose-500 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_25px_rgba(244,63,94,0.1)]">
                <p className="text-[10px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Sick balance</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.sick} <span className="text-xs font-semibold text-slate-400">/ 6 Days</span></h3>
              </div>

              {/* Festival Leave */}
              <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-purple-500 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_25px_rgba(168,85,247,0.1)]">
                <p className="text-[10px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Festival balance</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.festival !== undefined ? myProfile.leaveBalance.festival : 2} <span className="text-xs font-semibold text-slate-400">/ 2 Days</span></h3>
              </div>

              {/* Short Leave */}
              <div className="bg-white dark:bg-[#151c28] border-t-[5px] border-t-amber-500 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_25px_rgba(245,158,11,0.1)]">
                <p className="text-[10px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Short balance</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-mono">{myProfile.leaveBalance.short !== undefined ? myProfile.leaveBalance.short : 4} <span className="text-xs font-semibold text-slate-400">/ 4 (2 hrs)</span></h3>
              </div>

            </div>
          )}

          {/* Leave Requests Log List Table */}
          <div className="bg-white dark:bg-[#151c28] border border-slate-200 dark:border-[#222e43] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden py-5 space-y-4">
            
            {/* Header info inside card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-1 px-5">
              <div className="flex items-center gap-2">
                <HiOutlineBadgeCheck className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isAdminOrHR ? "All Leave Requests" : "Your Leave Log"}
                </h3>
              </div>

              {/* Page size selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-slate-400 font-medium">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-1 font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-250 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>Records per page</span>
              </div>
            </div>

            {/* Table wrapper touching card boundaries */}
            <div className="overflow-x-auto border-y border-slate-200 dark:border-[#222e43]/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#222e43] bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Employee</th>
                    <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Dates</th>
                    <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Type</th>
                    <th className="border-r border-slate-200 dark:border-[#222e43] px-5 py-3.5">Reason</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {(() => {
                    const totalEntries = visibleLeaves.length;
                    const startIndex = (currentPage - 1) * pageSize;
                    const paginatedLeaves = visibleLeaves.slice(startIndex, startIndex + pageSize);

                    if (paginatedLeaves.length === 0) {
                      return (
                        <tr>
                          <td colSpan="5" className="text-center py-12 text-slate-450 border-b border-slate-200 dark:border-[#222e43]">
                            No leave requests filed.
                          </td>
                        </tr>
                      );
                    }

                    return paginatedLeaves.map((l) => (
                      <tr key={l.id} className="border-b border-slate-200 dark:border-[#222e43]/50 hover:bg-gray-100 dark:hover:bg-slate-800/40 transition-colors duration-150">
                        {/* Employee */}
                        <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 font-bold text-slate-850 dark:text-slate-200">
                          {l.employeeName}
                        </td>

                        {/* Dates */}
                        <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 text-slate-500 dark:text-slate-400 font-mono font-medium">
                          {l.startDate} <span className="text-[10px] text-slate-400">to</span> {l.endDate}
                          <div className="text-[10px] text-slate-450 dark:text-slate-550 font-bold mt-0.5">{l.days} Days</div>
                        </td>

                        {/* Leave Type */}
                        <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 text-slate-655 dark:text-slate-350 font-bold text-[10px] uppercase tracking-wider">
                          {l.type}
                        </td>

                        {/* Reason */}
                        <td className="border-r border-slate-200 dark:border-[#222e43]/50 px-5 py-3 text-slate-500 dark:text-slate-455 italic max-w-xs truncate" title={l.reason}>
                          {l.reason}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                              ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                l.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400' :
                                'bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-455'}`}
                            >
                              {l.status}
                            </span>

                            {/* HR approval actions */}
                            {isAdminOrHR && l.status === 'Pending' && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <button
                                  onClick={() => updateLeaveStatus(l.id, 'Approved')}
                                  className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:bg-emerald-950/30 transition-all cursor-pointer border border-emerald-200"
                                  title="Approve"
                                >
                                  <HiCheck className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => updateLeaveStatus(l.id, 'Rejected')}
                                  className="p-1 rounded-md bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 dark:bg-rose-955/30 transition-all cursor-pointer border border-rose-250"
                                  title="Reject"
                                >
                                  <HiX className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer controls */}
            {(() => {
              const totalEntries = visibleLeaves.length;
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
        </>
      )}

    </div>
  );
};

export default Leave;
