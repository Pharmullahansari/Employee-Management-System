import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MiniChart } from '../components/MiniChart';
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineFolderOpen,
  HiOutlineChevronLeft,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineDeviceMobile,
  HiCheckCircle
} from 'react-icons/hi';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { currentUser, employees, leaves } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  // If no ID is passed, default to currently logged-in user
  const profileId = id || currentUser?.id;
  const emp = employees.find(e => e.id === profileId);

  // If employee not found
  if (!emp) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="font-bold">Employee records not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Filter leaves for this employee
  const employeeLeaves = leaves.filter(l => l.employeeId === emp.id);

  // Mock document status
  const initialDocs = [
    { name: 'Signed Employment Contract', status: true },
    { name: 'Government ID & PAN Copy', status: true },
    { name: 'Educational Certificates', status: true },
    { name: 'Relieving & Experience Letter', status: false },
    { name: 'NDA (Non-Disclosure Agreement)', status: true }
  ];

  return (
    <div className="space-y-6">

      {/* Header Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4" />
        Back toEmployee List
      </button>

      {/* Hero card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-6">
        <img
          src={emp.photo}
          alt={emp.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/10"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">{emp.name}</h2>
            <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 max-w-fit mx-auto md:mx-0">
              {emp.role}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
            {emp.designation} • <span className="text-indigo-600 dark:text-indigo-400">{emp.department}</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Member since {emp.joiningDate}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 justify-center md:justify-start">
              <HiOutlineMail className="w-4 h-4 text-slate-400" />
              {emp.email}
            </span>
            <span className="flex items-center gap-1.5 justify-center md:justify-start font-mono">
              <HiOutlinePhone className="w-4 h-4 text-slate-400" />
              {emp.phone}
            </span>
            <span className="flex items-center gap-1.5 justify-center md:justify-start">
              <HiOutlineDeviceMobile className="w-4 h-4 text-slate-400" />
              ID: {emp.id}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto gap-4">
        {[
          { id: 'personal', name: 'Personal Details', icon: HiOutlineUser },
          { id: 'attendance', name: 'Attendance Stats', icon: HiOutlineCalendar },
          { id: 'leaves', name: 'Leave Tracker', icon: HiOutlineClipboardList },
          { id: 'salary', name: 'Salary Details', icon: HiOutlineCurrencyRupee },
          { id: 'documents', name: 'Document Vault', icon: HiOutlineFolderOpen }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-all px-1 whitespace-nowrap cursor-pointer
              ${activeTab === tab.id
                ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <tab.icon className="w-4.5 h-4.5" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs min-h-[220px]">

        {/* Personal Details Panel */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-450 uppercase tracking-wider">Demographics</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">Date of Birth</p>
                  <p className="font-bold text-slate-700 dark:text-white font-mono">{emp.dob}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">Gender</p>
                  <p className="font-bold text-slate-700 dark:text-white">{emp.gender}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-450 uppercase tracking-wider">Emergency Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">Contact Name</p>
                  <p className="font-bold text-slate-700 dark:text-white">{emp.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">Relation</p>
                  <p className="font-bold text-slate-700 dark:text-white">{emp.emergencyContact.relation}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">Phone Number</p>
                  <p className="font-bold text-slate-700 dark:text-white font-mono">{emp.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Stats Panel */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex flex-col items-center">
              <MiniChart type="donut" data={[96]} height={110} />
              <p className="text-xs font-bold mt-2 text-slate-800 dark:text-white">Active Duty Score</p>
            </div>

            <div className="md:col-span-2 space-y-4 text-xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Breakdown (Current Month)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">Present</p>
                  <h3 className="text-lg font-black mt-1 text-emerald-705 dark:text-emerald-305">{emp.attendanceStats.present} Days</h3>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                  <p className="text-rose-600 dark:text-rose-400 font-bold">Absent</p>
                  <h3 className="text-lg font-black mt-1 text-rose-705 dark:text-rose-305">{emp.attendanceStats.absent} Days</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                  <p className="text-amber-600 dark:text-amber-400 font-bold">Late Arrival</p>
                  <h3 className="text-lg font-black mt-1 text-amber-705 dark:text-amber-305">{emp.attendanceStats.late || 0} Days</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Tracker Panel */}
        {activeTab === 'leaves' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leave Balances</h4>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-bold">Casual Leave</p>
                <h3 className="text-base font-black mt-1 text-slate-800 dark:text-white">{emp.leaveBalance.casual} Days remaining</h3>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-bold">Sick Leave</p>
                <h3 className="text-base font-black mt-1 text-slate-800 dark:text-white">{emp.leaveBalance.sick} Days remaining</h3>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-bold">Paid Leave</p>
                <h3 className="text-base font-black mt-1 text-slate-800 dark:text-white">{emp.leaveBalance.paid} Days remaining</h3>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave History</h4>
            {employeeLeaves.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-semibold text-black dark:text-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Dates</th>
                      <th className="px-4 py-2">Days</th>
                      <th className="px-4 py-2">Reason</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {employeeLeaves.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-350">{l.type}</td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">{l.startDate} to {l.endDate}</td>
                        <td className="px-4 py-2.5 text-slate-500">{l.days} days</td>
                        <td className="px-4 py-2.5 text-slate-550 dark:text-slate-400">{l.reason}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase
                            ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                              l.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                                'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455'}`}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-450 italic">No leaves registered for this period.</p>
            )}
          </div>
        )}

        {/* Salary details Panel */}
        {activeTab === 'salary' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Earnings Breakdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl">
                <p className="text-slate-400 font-bold mb-1">Base Monthly Salary</p>
                <h3 className="text-base font-black text-slate-800 dark:text-white font-mono">₹{emp.salary.toLocaleString('en-IN')}</h3>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl">
                <p className="text-slate-400 font-bold mb-1">Tax Deductions (10%)</p>
                <h3 className="text-base font-black text-rose-600 font-mono">₹{(emp.salary * 0.1).toLocaleString('en-IN')}</h3>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl">
                <p className="text-slate-400 font-bold mb-1">PF Contribution (12%)</p>
                <h3 className="text-base font-black text-rose-600 font-mono">₹{(emp.salary * 0.12).toLocaleString('en-IN')}</h3>
              </div>

              <div className="p-4 bg-gradient-to-tr from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-950/10 border border-indigo-200 dark:border-indigo-900/40 rounded-xl">
                <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">Est. Net Take Home</p>
                <h3 className="text-base font-black text-indigo-700 dark:text-indigo-305 font-mono">₹{(emp.salary * 0.78).toLocaleString('en-IN')}</h3>
              </div>

            </div>
          </div>
        )}

        {/* Documents vault Panel */}
        {activeTab === 'documents' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Onboarding Documents Status</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {initialDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-350">{doc.name}</span>
                  {doc.status ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded">
                      <HiCheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded">
                      ⚠️ Pending Submission
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default EmployeeProfile;
