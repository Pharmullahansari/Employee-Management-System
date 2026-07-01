import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MiniChart } from '../components/MiniChart';
import {
    HiOutlineCalendar,
    HiOutlineClipboardList,
    HiOutlineOfficeBuilding
} from 'react-icons/hi';

const EmployeeDashboard = () => {
    const { currentUser, employees, leaves, attendance, applyLeave, logAttendance } = useData();
    const navigate = useNavigate();

    // Find present today
    const today = '2026-06-27'; // simulated today date matching mock data
    const todayRecords = attendance[today] || {};

    // Employee Specific Stats & States
    const myProfile = employees.find(e => e.id === currentUser?.id) || employees[0];

    // Leave application state
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleApply = (e) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) {
            alert("Please enter valid dates and reasons.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3605 * 24)) + 1;

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

    const handleMarkToday = (status) => {
        if (currentUser) {
            logAttendance(today, currentUser.id, status);
        }
    };

    // Generate calendar days for visual checklist (June 2026)
    const calendarDays = Array.from({ length: 30 }, (_, i) => {
        const dayNum = i + 1;
        const dateStr = `2026-06-${String(dayNum).padStart(2, '0')}`;

        // Get status for current logged-in employee on this day
        const dayRecords = attendance[dateStr] || {};
        const myStatus = currentUser ? dayRecords[currentUser.id] : null;

        // Check if weekend (June 2026 starts on Monday. 6, 7, 13, 14, 20, 21, 27, 28 are Saturdays and Sundays)
        const isWeekend = dayNum % 7 === 6 || dayNum % 7 === 0;
        return {
            day: dayNum,
            date: dateStr,
            status: myStatus || (dayNum === 27 ? myStatus : dayNum === 26 ? 'Absent' : dayNum < 26 ? 'Present' : null),
            isWeekend
        };
    });

    const upcomingHolidays = [
        { date: '2026-07-16', name: 'Al-Hijra (Islamic New Year)', type: 'Gazetted Holiday' },
        { date: '2026-08-15', name: 'Independence Day', type: 'National Holiday' },
        { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti', type: 'National Holiday' },
        { date: '2026-11-08', name: 'Diwali (Festival of Lights)', type: 'Festival Holiday' },
        { date: '2026-12-25', name: 'Christmas Day', type: 'Gazetted Holiday' }
    ];

    // Leave requests for the logged-in employee
    const myLeaves = leaves.filter(l => l.employeeId === currentUser?.id);

    if (!currentUser) return null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left Column: Attendance & Leaves */}
            <div className="xl:col-span-2 space-y-6">

                {/* My Attendance Card */}
                <div className="p-5 bg-red-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl">
                                <HiOutlineCalendar className="w-5 h-5" />
                            </span>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">My Attendance Registry</h3>
                                <p className="text-[10px] text-slate-400">June 2026 Ledger & Shifts</p>
                            </div>
                        </div>

                        {/* Active check-in indicator */}
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-855">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Today:</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                ${todayRecords[currentUser.id] === 'Present' ? 'bg-emerald-55 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                    todayRecords[currentUser.id] === 'Half-Day' ? 'bg-amber-55 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400' :
                                        todayRecords[currentUser.id] === 'Absent' ? 'bg-rose-55 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400' :
                                            'bg-slate-105 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                            >
                                {todayRecords[currentUser.id] || 'Not Marked'}
                            </span>
                        </div>
                    </div>

                    {/* Attendance Quick Interactions */}
                    {!todayRecords[currentUser.id] && (
                        <div className="mb-5 p-4 bg-indigo-55/50 dark:bg-indigo-955/20 border border-indigo-105 dark:border-indigo-900/30 rounded-2xl text-center">
                            <p className="text-xs font-semibold text-slate-650 dark:text-indigo-200 mb-3">You haven't checked-in for work today. Mark your status:</p>
                            <div className="flex items-center justify-center gap-2.5">
                                <button
                                    onClick={() => handleMarkToday('Present')}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                                >
                                    Check-In (Present)
                                </button>
                                <button
                                    onClick={() => handleMarkToday('Half-Day')}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                                >
                                    Half Day
                                </button>
                                <button
                                    onClick={() => handleMarkToday('Absent')}
                                    className="px-4 py-2 bg-rose-500 hover:bg-rose-650 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                                >
                                    Absent
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stats & Calendar Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Visual Rate */}
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/10 border-2 border-blue-200 rounded-2xl">
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Monthly Index</p>
                            <MiniChart type="donut" data={[95]} height={90} />
                            <div className="mt-4 text-xs space-y-1.5 w-full font-medium">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Present Days:</span>
                                    <span className="font-bold text-slate-700 dark:text-white">{myProfile.attendanceStats.present || 21}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Late Arrivals:</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">{myProfile.attendanceStats.late || 1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Absences:</span>
                                    <span className="font-bold text-rose-550">{myProfile.attendanceStats.absent || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Layout */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">
                                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map(dayObj => (
                                    <div
                                        key={dayObj.day}
                                        className={`aspect-square flex flex-col items-center justify-between p-1 rounded-lg text-[10px] font-bold select-none transition-all
                      ${dayObj.isWeekend
                                                ? 'bg-indigo-300 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/20'
                                                : dayObj.status === 'Present'
                                                    ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/20'
                                                    : dayObj.status === 'Absent'
                                                        ? 'bg-rose-100 dark:bg-rose-955 text-rose-600 dark:text-rose-450 border border-rose-100/50 dark:border-rose-900/20'
                                                        : dayObj.status === 'Half-Day'
                                                            ? 'bg-amber-100 dark:bg-amber-955 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/20'
                                                            : 'bg-slate-200 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-850'
                                            }`}
                                        title={`${dayObj.date} ${dayObj.isWeekend ? '(Weekend Off)' : dayObj.status || '(No Record)'}`}
                                    >
                                        <span>{dayObj.day}</span>
                                        {dayObj.isWeekend ? (
                                            <span className="text-[7px] text-indigo-800 uppercase tracking-widest font-black">Off</span>
                                        ) : dayObj.status ? (
                                            <span className={`w-2 h-2 rounded-full 
                        ${dayObj.status === 'Present' ? 'bg-emerald-500' :
                                                    dayObj.status === 'Half-Day' ? 'bg-amber-500' : 'bg-rose-500'}`}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Legend */}
                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 inline-block" />
                                    <span>Present</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-amber-500 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 inline-block" />
                                    <span>Half Day</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-rose-500 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 inline-block" />
                                    <span>Absent</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-indigo-500 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/20 inline-block" />
                                    <span>Weekend Off</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* My Leaves Balance & Log Card */}
                <div className="space-y-6">

                    {/* Leave Balances Header Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Casual Leave</p>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white font-mono">
                                {myProfile.leaveBalance.casual} <span className="text-xs font-semibold text-slate-400">/ 10 Left</span>
                            </h3>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(myProfile.leaveBalance.casual / 10) * 100}%` }} />
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sick Leave</p>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white font-mono">
                                {myProfile.leaveBalance.sick} <span className="text-xs font-semibold text-slate-400">/ 10 Left</span>
                            </h3>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(myProfile.leaveBalance.sick / 10) * 100}%` }} />
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Paid Leave</p>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white font-mono">
                                {myProfile.leaveBalance.paid} <span className="text-xs font-semibold text-slate-400">/ 15 Left</span>
                            </h3>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className="bg-emerald-55 h-full rounded-full" style={{ width: `${(myProfile.leaveBalance.paid / 15) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* My Leave Requests Log Table */}
                    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                            <span className="p-2 bg-amber-50 dark:bg-amber-955 text-amber-600 dark:text-amber-400 rounded-xl">
                                <HiOutlineClipboardList className="w-5 h-5" />
                            </span>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">My Leave Log</h3>
                                <p className="text-[10px] text-slate-400">Leave applications and approval states</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[9px] font-bold text-slate-405 uppercase tracking-widest border-b border-slate-105 dark:border-slate-800">
                                        <th className="px-3 py-2.5">Category</th>
                                        <th className="px-3 py-2.5">Duration</th>
                                        <th className="px-3 py-2.5">Reason</th>
                                        <th className="px-3 py-2.5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {myLeaves.length > 0 ? (
                                        myLeaves.map((l) => (
                                            <tr key={l.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                                                <td className="px-3 py-2.5 font-bold text-slate-700 dark:text-slate-300">{l.type}</td>
                                                <td className="px-3 py-2.5 text-slate-500 font-mono text-[10px]">
                                                    {l.startDate} <span className="text-slate-400">to</span> {l.endDate}
                                                    <div className="text-[9px] text-slate-400 font-sans mt-0.5">{l.days} Days</div>
                                                </td>
                                                <td className="px-3 py-2.5 text-slate-500 italic max-w-xs truncate" title={l.reason}>
                                                    {l.reason}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                            ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                                            l.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400' :
                                                                'bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400'}`}
                                                    >
                                                        {l.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-6 text-slate-400 text-xs">
                                                No leave applications filed yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Column: Holidays/Week Off & Apply Leave Form */}
            <div className="space-y-6">

                {/* Holidays & Week-offs Card */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                        <span className="p-2 bg-emerald-50 dark:bg-emerald-955 text-emerald-650 dark:text-emerald-400 rounded-xl">
                            <HiOutlineOfficeBuilding className="w-5 h-5" />
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Holidays & Week Offs</h3>
                            <p className="text-[10px] text-slate-400">Studio Calendar Rest Days</p>
                        </div>
                    </div>

                    {/* Week off info */}
                    <div className="p-3 bg-violet-50/50 dark:bg-violet-955/20 border border-violet-100 dark:border-violet-900/30 rounded-xl mb-4 text-xs">
                        <p className="font-bold text-violet-755 dark:text-violet-300 mb-0.5">Weekly Off Days</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Saturdays and Sundays are standard week-off days for all studio members.</p>
                    </div>

                    {/* Holiday list */}
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-2.5">Upcoming Holidays</p>
                    <div className="space-y-2.5">
                        {upcomingHolidays.map((holiday, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl text-xs">
                                <div>
                                    <p className="font-bold text-slate-705 dark:text-slate-300">{holiday.name}</p>
                                    <span className="text-[9px] font-semibold text-slate-400">{holiday.type}</span>
                                </div>
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-md">
                                    {holiday.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Apply Leave Form Card */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                        <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl">
                            <HiOutlineClipboardList className="w-5 h-5" />
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Request Leave</h3>
                            <p className="text-[10px] text-slate-400">File leave application instantly</p>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="mb-4 p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleApply} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1">Leave Category</label>
                            <select
                                value={leaveType}
                                onChange={(e) => setLeaveType(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-250 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="Casual Leave">Casual Leave</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Paid Leave">Paid Leave</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-250 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-250 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-1">Detailed Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Brief description of your leave..."
                                rows="2.5"
                                className="w-full px-3 py-2 rounded-xl bg-slate-55 border border-slate-255 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-800 bg-indigo-600 transition-colors cursor-pointer shadow-sm shadow-indigo-500/10"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>

            </div>

        </div>
    );
};

export default EmployeeDashboard;
