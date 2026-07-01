import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { HiOutlineCurrencyRupee, HiOutlineDownload, HiOutlineEye, HiCheck } from 'react-icons/hi';

const Payroll = () => {
  const { currentUser, employees } = useData();

  const isAdminOrHR = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'HR');

  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [bonus, setBonus] = useState(5000);
  const [deductions, setDeductions] = useState(2500);

  // Payslip Modal
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [payslipTarget, setPayslipTarget] = useState(null);

  const selectedEmp = employees.find(e => e.id === (isAdminOrHR ? selectedEmpId : currentUser?.id)) || employees[0];

  const handleRecalculate = () => {
    if (!selectedEmp) return;
    const base = selectedEmp.salary;
    const taxes = Math.round(base * 0.1); // 10% tax
    const totalDeductions = deductions + taxes;
    const net = base + bonus - totalDeductions;
    return { base, bonus, deductions: totalDeductions, net };
  };

  const calc = handleRecalculate();

  const handleOpenPayslip = (emp) => {
    setPayslipTarget(emp);
    setIsPayslipOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {isAdminOrHR ? (
        /* ================= ADMIN/HR CONTROLS ================= */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Salary Adjustment panel */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              Salary Calculator Simulator
            </h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                  ))}
                </select>
              </div>

              {selectedEmp && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Pay: ₹{selectedEmp.salary.toLocaleString('en-IN')}</label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bonus Rewards (₹)</label>
                    <input 
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={bonus}
                      onChange={(e) => setBonus(Number(e.target.value))}
                      className="w-full accent-indigo-650 cursor-pointer"
                    />
                    <div className="flex justify-between font-mono font-bold mt-1 text-slate-600 dark:text-slate-400">
                      <span>₹0</span>
                      <span>₹{bonus.toLocaleString('en-IN')}</span>
                      <span>₹30,000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Voluntary Deductions (₹)</label>
                    <input 
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={deductions}
                      onChange={(e) => setDeductions(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between font-mono font-bold mt-1 text-slate-600 dark:text-slate-400">
                      <span>₹0</span>
                      <span className="text-rose-600">₹{deductions.toLocaleString('en-IN')}</span>
                      <span>₹20,000</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {calc && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Salary:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">₹{calc.base.toLocaleString('en-IN')}</span>
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
                  <span className="text-indigo-650 dark:text-indigo-400 font-mono">₹{calc.net.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Employee list salary grid */}
          <div className="xl:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              Salary Ledgers (Ansari Production)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
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
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{emp.name}</span>
                          <div className="text-[10px] text-slate-400">{emp.designation}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 font-mono">₹{emp.salary.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono">₹{pf.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono">₹{tax.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleOpenPayslip(emp)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                            title="Generate Payslip"
                          >
                            <HiOutlineEye className="w-4.5 h-4.5" />
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
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-808 dark:text-white">Your Monthly Compensation</h3>
            <button
              onClick={() => handleOpenPayslip(selectedEmp)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-650 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 text-xs font-semibold cursor-pointer"
            >
              <HiOutlineEye className="w-4 h-4" />
              View Payslip
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Base Monthly Salary:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">₹{selectedEmp.salary.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provident Fund (PF):</span>
              <span className="font-semibold text-rose-500 font-mono">-₹{(selectedEmp.salary * 0.12).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tax Deductions (10%):</span>
              <span className="font-semibold text-rose-500 font-mono">-₹{(selectedEmp.salary * 0.10).toLocaleString('en-IN')}</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
            <div className="flex justify-between font-bold text-sm bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg">
              <span className="text-slate-800 dark:text-white">Estimated Net Transfer:</span>
              <span className="text-emerald-600 font-mono">₹{(selectedEmp.salary * 0.78).toLocaleString('en-IN')}</span>
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 cursor-pointer"
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
                <p className="text-xs font-mono font-bold">June 2026</p>
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
