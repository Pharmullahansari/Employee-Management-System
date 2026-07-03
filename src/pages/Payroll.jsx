import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { 
  HiOutlineCurrencyRupee, 
  HiOutlineDownload, 
  HiOutlineEye, 
  HiCheck, 
  HiOutlineTrendingUp, 
  HiOutlineCash,
  HiOutlineCalculator
} from 'react-icons/hi';

const Payroll = () => {
  const { currentUser, employees } = useData();

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [bonus, setBonus] = useState(5000);
  const [deductions, setDeductions] = useState(2500);

  // Payslip Modal
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [payslipTarget, setPayslipTarget] = useState(null);
  const [payslipMonth, setPayslipMonth] = useState('June 2026');

  const selectedEmp = employees.find(e => e.id === (isAdminOrHR ? selectedEmpId : currentUser?.id)) || employees[0];

  const handleRecalculate = () => {
    if (!selectedEmp) return null;
    const base = selectedEmp.salary;
    const taxes = Math.round(base * 0.1); // 10% tax
    const totalDeductions = deductions + taxes;
    const net = base + bonus - totalDeductions;
    return { base, bonus, deductions: totalDeductions, net };
  };

  const calc = handleRecalculate();

  const handleOpenPayslip = (emp, month = 'June 2026') => {
    setPayslipTarget(emp);
    setPayslipMonth(month);
    setIsPayslipOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mock past payroll transactions for employee view
  const pastTransactions = [
    { month: 'June 2026', base: selectedEmp.salary, bonus: 5000, deductions: Math.round(selectedEmp.salary * 0.22), status: 'Disbursed', date: '2026-06-30' },
    { month: 'May 2026', base: selectedEmp.salary, bonus: 2000, deductions: Math.round(selectedEmp.salary * 0.22), status: 'Disbursed', date: '2026-05-31' },
    { month: 'April 2026', base: selectedEmp.salary, bonus: 0, deductions: Math.round(selectedEmp.salary * 0.22), status: 'Disbursed', date: '2026-04-30' },
    { month: 'March 2026', base: selectedEmp.salary, bonus: 4500, deductions: Math.round(selectedEmp.salary * 0.22), status: 'Disbursed', date: '2026-03-31' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Breadcrumbs */}
      <div>
        <h2 className="text-xl font-bold text-black dark:text-white">Payroll</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          <span className="hover:underline cursor-pointer text-indigo-500">Home</span> &gt; Payroll
        </p>
      </div>

      {isAdminOrHR ? (
        /* ================= ADMIN/HR CONTROLS ================= */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Salary Adjustment panel */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-850">
                <HiOutlineCalculator className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-black text-black dark:text-white">
                  Salary Calculator Simulator
                </h3>
              </div>
              
              <div className="space-y-5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Target Employee</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                    ))}
                  </select>
                </div>

                {selectedEmp && (
                  <>
                    <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between">
                      <span className="font-semibold text-indigo-755 dark:text-indigo-400">Base Salary</span>
                      <span className="font-extrabold text-slate-700 dark:text-slate-200 font-mono">₹{selectedEmp.salary.toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Bonus Rewards</label>
                        <span className="font-bold text-indigo-600 font-mono text-[11px]">₹{bonus.toLocaleString('en-IN')}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="30000"
                        step="500"
                        value={bonus}
                        onChange={(e) => setBonus(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Voluntary Deductions</label>
                        <span className="font-bold text-rose-500 font-mono text-[11px]">-₹{deductions.toLocaleString('en-IN')}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="20000"
                        step="500"
                        value={deductions}
                        onChange={(e) => setDeductions(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {calc && (
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Salary:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-350 font-mono">₹{calc.base.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bonus Added:</span>
                  <span className="font-semibold text-emerald-600 font-mono">+₹{calc.bonus.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deductions (inc. tax):</span>
                  <span className="font-semibold text-rose-500 font-mono">-₹{calc.deductions.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-800 dark:text-white">Net Take Home:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">₹{calc.net.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Employee list salary ledgers */}
          <div className="xl:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="text-sm font-black text-black dark:text-white">
                Salary Ledgers (Ansari Production)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-semibold text-black dark:text-slate-200 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Base Salary</th>
                    <th className="px-4 py-3">Provident Fund</th>
                    <th className="px-4 py-3">Tax Deductions</th>
                    <th className="px-4 py-3 text-center">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {employees.map(emp => {
                    const pf = Math.round(emp.salary * 0.12);
                    const tax = Math.round(emp.salary * 0.10);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-700 dark:text-slate-350">{emp.name}</span>
                          <div className="text-[10px] text-slate-450">{emp.designation}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 font-mono">₹{emp.salary.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-slate-450 font-mono">₹{pf.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-slate-450 font-mono">₹{tax.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleOpenPayslip(emp)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer shadow-2xs"
                            title="Generate Payslip"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* ================= EMPLOYEE VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Your Monthly Compensation breakdown */}
          <div className="lg:col-span-1 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850 mb-4">
                <HiOutlineCurrencyRupee className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-black text-black dark:text-white">Your Salary Summary</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Monthly Salary:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">₹{selectedEmp.salary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provident Fund (PF - 12%):</span>
                  <span className="font-semibold text-rose-500 font-mono">-₹{(selectedEmp.salary * 0.12).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax Deductions (10%):</span>
                  <span className="font-semibold text-rose-500 font-mono">-₹{(selectedEmp.salary * 0.10).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <div className="flex justify-between font-bold text-sm bg-indigo-50/30 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                <span className="text-slate-800 dark:text-white flex items-center gap-1"><HiOutlineCash className="w-4 h-4 text-indigo-500" /> Net Transfer:</span>
                <span className="text-emerald-600 font-mono font-black">₹{(selectedEmp.salary * 0.78).toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={() => handleOpenPayslip(selectedEmp)}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-500/10 active:scale-98"
              >
                <HiOutlineEye className="w-4.5 h-4.5" />
                View Current Payslip
              </button>
            </div>
          </div>

          {/* Card 2: Transaction History & Ledgers */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850 mb-4">
                <HiOutlineTrendingUp className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-black text-black dark:text-white">Disbursement Ledgers</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-semibold text-black dark:text-slate-200 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-3">Month</th>
                      <th className="px-4 py-3">Transferred Date</th>
                      <th className="px-4 py-3">Net Compensation</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Payslip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {pastTransactions.map((tx, idx) => {
                      const netComp = tx.base + tx.bonus - tx.deductions;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-350">{tx.month}</td>
                          <td className="px-4 py-3 text-slate-450 font-mono">{tx.date}</td>
                          <td className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 font-mono">₹{netComp.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30">
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleOpenPayslip(selectedEmp, tx.month)}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 transition-all cursor-pointer shadow-2xs"
                              title="View Payslip"
                            >
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Interactive Mock Payslip Modal */}
      {isPayslipOpen && payslipTarget && (
        <Modal
          isOpen={isPayslipOpen}
          onClose={() => setIsPayslipOpen(false)}
          title="Generated Payslip Certificate"
          footerActions={
            <>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-500/10"
              >
                <HiOutlineDownload className="w-4 h-4" />
                Print/Download Payslip
              </button>
            </>
          }
        >
          {/* Printable Template Box */}
          <div id="print-area" className="p-6 bg-white border border-slate-200 rounded-xl text-slate-800 space-y-6">
            
            {/* Header branding */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="font-black text-lg text-indigo-700">ANSARI PRODUCTION</h2>
                <p className="text-[10px] text-slate-500">Sector-V, VFX & Post-production Hub, Mumbai</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary Slip</span>
                <p className="text-xs font-mono font-bold">{payslipMonth}</p>
              </div>
            </div>

            {/* Info Metadata */}
            <div className="grid grid-cols-2 gap-4 text-[10px] border-b pb-4">
              <div>
                <p className="font-semibold text-slate-400">Employee Name</p>
                <p className="font-bold text-slate-700">{payslipTarget.name}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Employee ID</p>
                <p className="font-bold text-slate-700 font-mono">{payslipTarget.id}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Designation & Department</p>
                <p className="font-bold text-slate-700">{payslipTarget.designation} ({payslipTarget.department})</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Account Number</p>
                <p className="font-bold text-slate-700 font-mono">XXXX-XXXX-9843</p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between py-1 border-b">
                <span>Basic Earnings:</span>
                <span className="font-bold font-mono">₹{payslipTarget.salary.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-emerald-600">
                <span>Bonuses / Incentives:</span>
                <span className="font-bold font-mono">+₹{bonus.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-rose-500">
                <span>Tax Deductions (10%):</span>
                <span className="font-bold font-mono">-₹{(payslipTarget.salary * 0.1).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-rose-500">
                <span>Provident Fund (12%):</span>
                <span className="font-bold font-mono">-₹{(payslipTarget.salary * 0.12).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between pt-3 text-xs font-black border-t">
                <span className="text-slate-800">Total Net Paid:</span>
                <span className="text-indigo-700 font-mono">₹{(payslipTarget.salary + bonus - (payslipTarget.salary * 0.22) - (payslipTarget === selectedEmp ? deductions : 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Signature Box */}
            <div className="pt-8 flex justify-between text-[8px] text-slate-450 uppercase font-bold">
              <div>
                <p className="border-t pt-1 w-24">Employee Signature</p>
              </div>
              <div className="text-right">
                <p className="border-t pt-1 w-24 ml-auto">HR Director</p>
              </div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default Payroll;
