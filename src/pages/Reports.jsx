import React from 'react';
import { useData } from '../context/DataContext';
import MiniChart from '../components/MiniChart';
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineCalendar, HiOutlineCreditCard } from 'react-icons/hi';

const Reports = () => {
  const { employees, departments } = useData();

  // 1. Calculate department total budgets
  const deptBudgets = departments.map(d => {
    const crew = employees.filter(e => e.department === d.name);
    const totalSalary = crew.reduce((acc, curr) => acc + curr.salary, 0);
    return {
      label: d.code,
      value: totalSalary
    };
  });

  // 2. Growth timeline data (active count)
  const growthTimeline = [2, 3, 3, 4, 4, employees.length];

  // 3. Attendance timeline
  const attendanceTimeline = [88, 92, 90, 94, 91, 95, 93];

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reports 1: Salary budget */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Department Salary Budget</h3>
              <HiOutlineCreditCard className="w-5 h-5 text-indigo-505" />
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Total salary budget assigned by department (Code representation)</p>
          </div>
          <div className="h-28 flex items-end">
            <MiniChart type="bar" data={deptBudgets} height={110} />
          </div>
        </div>

        {/* Reports 2: Attendance Index */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance Index Curve</h3>
              <HiOutlineCalendar className="w-5 h-5 text-indigo-505" />
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Daily percentage attendance index score over previous week</p>
          </div>
          <div className="h-28">
            <MiniChart type="line" data={attendanceTimeline} height={100} />
          </div>
        </div>

        {/* Reports 3: Crew growth */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Crew Growth Curve</h3>
              <HiOutlineTrendingUp className="w-5 h-5 text-indigo-505" />
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Total crew onboarding trend registered over the last 6 months</p>
          </div>
          <div className="h-28">
            <MiniChart type="line" data={growthTimeline} height={100} />
          </div>
        </div>

      </div>

      {/* Analytical Tabular breakdown */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Analytics Sheet</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Headcount</th>
                <th className="px-4 py-3">Avg Salary</th>
                <th className="px-4 py-3">Monthly Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {departments.map(dept => {
                const crew = employees.filter(e => e.department === dept.name);
                const totalSalary = crew.reduce((acc, curr) => acc + curr.salary, 0);
                const avgSalary = crew.length > 0 ? Math.round(totalSalary / crew.length) : 0;
                
                return (
                  <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{dept.name}</td>
                    <td className="px-4 py-3 text-slate-550 dark:text-slate-400">{crew.length} member(s)</td>
                    <td className="px-4 py-3 font-mono text-slate-550 dark:text-slate-400">₹{avgSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-650 dark:text-indigo-400 font-mono">₹{totalSalary.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Reports;
