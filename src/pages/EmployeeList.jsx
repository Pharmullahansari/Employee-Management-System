import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiPlus } from 'react-icons/hi';

const EmployeeList = () => {
  const { currentUser, employees, departments, deleteEmployee, updateEmployee } = useData();
  const navigate = useNavigate();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingEmp, setCurrentEditingEmp] = useState(null);

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleEditClick = (emp) => {
    setCurrentEditingEmp({ ...emp });
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (currentEditingEmp) {
      updateEmployee(currentEditingEmp.id, currentEditingEmp);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to remove this employee from Ansari Production's records?")) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-3.5 text-slate-400 w-5 h-5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by ID, name or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-505 dark:text-white transition-all shadow-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
            <HiOutlineFilter className="text-slate-400 mr-2 w-4 h-4" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-300 font-bold focus:outline-none cursor-pointer pr-4"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => navigate('/add-employee')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
          >
            <HiPlus className="w-4 h-4" />
            Add Crew
          </button>
        </div>
      </div>

      {/* Employees Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    
                    {/* User Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={emp.photo} 
                          alt={emp.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{emp.name}</p>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-medium font-mono">{emp.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {emp.department}
                    </td>

                    {/* Designation */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {emp.designation}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">
                      {emp.phone}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/profile/${emp.id}`)}
                          className="p-2 text-slate-500 hover:text-indigo-650 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(emp)}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Edit Profile"
                        >
                          <HiOutlinePencilAlt className="w-4 h-4" />
                        </button>
                        {currentUser && currentUser.id !== emp.id && (
                          <button 
                            onClick={() => handleDeleteClick(emp.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Delete Records"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <p className="font-semibold">No crew members found matching search query.</p>
                    <span className="text-[10px]">Try adjusting filters or checking the spelling.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && currentEditingEmp && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Modify Details for ${currentEditingEmp.name}`}
          footerActions={
            <>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSave}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-750 cursor-pointer"
              >
                Save Updates
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text"
                value={currentEditingEmp.name}
                onChange={(e) => setCurrentEditingEmp({ ...currentEditingEmp, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                <select
                  value={currentEditingEmp.department}
                  onChange={(e) => setCurrentEditingEmp({ ...currentEditingEmp, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                >
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Designation</label>
                <input 
                  type="text"
                  value={currentEditingEmp.designation}
                  onChange={(e) => setCurrentEditingEmp({ ...currentEditingEmp, designation: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                <input 
                  type="text"
                  value={currentEditingEmp.phone}
                  onChange={(e) => setCurrentEditingEmp({ ...currentEditingEmp, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Salary (₹)</label>
                <input 
                  type="number"
                  value={currentEditingEmp.salary}
                  onChange={(e) => setCurrentEditingEmp({ ...currentEditingEmp, salary: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={currentEditingEmp.status}
                onChange={(e) => setCurrentEditingEmp({ ...currentEditingEmp, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default EmployeeList;
