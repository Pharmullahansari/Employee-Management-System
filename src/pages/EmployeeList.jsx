import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { HiOutlineSearch, HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiPlus } from 'react-icons/hi';

const EmployeeList = () => {
  const { currentUser, employees, departments, deleteEmployee, updateEmployee } = useData();
  const navigate = useNavigate();

  // Search & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingEmp, setCurrentEditingEmp] = useState(null);

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.phone || '').includes(searchTerm);
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Pagination calculation
  const totalEntries = filteredEmployees.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

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
    if (window.confirm("Are you sure you want to remove this employee's records?")) {
      deleteEmployee(id);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-5 text-left">

      {/* Breadcrumb & Header Action bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Home &rsaquo; <span className="text-blue-500 font-extrabold">Employee List</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Employee  List
          </h2>
        </div>

        <button
          onClick={() => navigate('/add-employee')}
          className="self-start flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <HiPlus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Main Table Card Grid */}
      <div className="bg-white dark:bg-[#151c28] border border-slate-200 dark:border-[#222e43] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden py-5 space-y-4">

        {/* Table Filter Controls bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-1 px-5">
          {/* Entries selector */}
          <div className="flex items-center gap-2 text-xs text-slate-550 dark:text-slate-400 font-medium">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-250 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>Records per page</span>

            {/* Department dropdown filter */}
            <span className="mx-2 text-slate-300">|</span>
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-250 cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex items-center max-w-xs">
            <HiOutlineSearch className="absolute left-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 dark:text-white shadow-xs font-semibold"
            />
          </div>
        </div>

        {/* Responsive Table grid */}
        <div className="overflow-x-auto border-y border-slate-200 dark:border-[#222e43]/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#222e43] bg-gray-100 text-xs font-bold  uppercase tracking-wider">
                <th className="px-5 py-3.5 w-12 text-center">#</th>
                <th className="px-5 py-3.5">Employee Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Email ID</th>
                <th className="px-5 py-3.5">Mobile Number</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp, index) => {
                  const sNo = startIndex + index + 1;
                  const digitsOnly = emp.id.replace(/\D/g, '') || String(sNo);
                  const badgeText = `E${digitsOnly}`;

                  return (
                    <tr key={emp.id} className="border-b border-slate-200 dark:border-[#222e43]/50 hover:bg-gray-100 dark:hover:bg-slate-800/40 transition-colors duration-150">
                      {/* Serial Number */}
                      <td className="px-5 py-3 text-slate-450 font-semibold text-center">{sNo}</td>

                      {/* Profile & Name */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {/* Colored ID Badge */}
                          <span className="w-8 h-7 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-900/30 shadow-2xs font-mono">
                            {badgeText}
                          </span>
                          <div>
                            <p className="font-bold text-slate-850 dark:text-slate-200">{emp.name}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{emp.designation}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-3 text-slate-655 dark:text-slate-350 font-bold uppercase tracking-wider text-[10px]">
                        {emp.department}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3">
                        <a 
                          href={`mailto:${emp.email || `${emp.id.toLowerCase()}@ansariproduction.com`}`}
                          className="text-blue-600 dark:text-blue-450 font-semibold hover:underline"
                        >
                          {emp.email || `${emp.id.toLowerCase()}@ansariproduction.com`}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-405 font-mono font-bold">
                        {emp.phone || '9876543210'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/profile/${emp.id}`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-md transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-md transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <HiOutlinePencilAlt className="w-4 h-4" />
                          </button>
                          {currentUser && currentUser.id !== emp.id && (
                            <button
                              onClick={() => handleDeleteClick(emp.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    <p className="font-semibold">No records found matching search filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer controls */}
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
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Last
            </button>
          </div>
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
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
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
