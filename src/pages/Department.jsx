import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HiOutlineOfficeBuilding, HiPlus, HiOutlineUserGroup } from 'react-icons/hi';

const Department = () => {
  const { departments, createDepartment, employees } = useData();

  // Create state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [manager, setManager] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !code || !manager) {
      alert("Please fill in all fields.");
      return;
    }
    createDepartment({ name, code, manager });
    setName('');
    setCode('');
    setManager('');
    setSuccessMsg('New department added successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Create Department Form */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HiOutlineOfficeBuilding className="w-5 h-5 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Establish Department</h3>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VFX & Post-Production"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="VFX"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none uppercase"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lead / Manager</label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="Manager Name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Create Department
            </button>
          </form>
        </div>

        {/* Departments statistics table */}
        <div className="xl:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HiOutlineUserGroup className="w-5 h-5 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Department Registers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => {
              // Get list of employees in this department
              const crew = employees.filter(e => e.department === dept.name);

              return (
                <div key={dept.id} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">{dept.name}</h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-mono">{dept.code} • Manager: {dept.manager}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                      {crew.length} Member(s)
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assigned Members</p>
                    <div className="flex -space-x-2 overflow-hidden">
                      {crew.map((member, idx) => (
                        <img
                          key={member.id}
                          src={member.photo}
                          alt={member.name}
                          title={member.name}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                        />
                      ))}
                      {crew.length === 0 && <span className="text-[10px] text-slate-450 italic">No members assigned</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Department;
